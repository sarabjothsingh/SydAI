const { getConfig } = require("../config");
const { getQdrantClient, ensureCollectionExists } = require("../clients/qdrantClient");
const { generate } = require("../clients/llmFactory");

const SUMMARY_PROMPT = ({ context }) => `System role: You are a world-class technical summarizer for engineering and policy documents.

Write a concise, accurate, well-structured summary of the provided content. Rules:
1) Use ONLY the provided content; do not add external knowledge.
2) Organize hierarchically:
   - If multiple documents, group by document with headings (Document: <filename>).
   - Within each, extract: key objectives, definitions, procedures/steps, decisions, thresholds/limits, timelines, responsibilities.
3) Prefer bullet points; use short paragraphs for context; use tables for structured comparisons.
4) Quote critical numeric thresholds verbatim.
5) Keep to the essential points; avoid redundancy.

Content to summarize:
${context}

Now produce the summary:`;

async function summarizeDocuments({ model, filenames = [] }) {
  if (!model) throw new Error("summarizeDocuments requires a model");

  const config = getConfig();
  const client = getQdrantClient();
  const collectionName = config.env.qdrant.collectionName;

  // Make sure the collection exists so scroll requests do not 404 on first use.
  await ensureCollectionExists(collectionName, config.env.qdrant.vectorSize);

  const filters = filenames.length
    ? {
        must: [
          {
            key: "metadata.filename",
            match: { any: filenames },
          },
        ],
      }
    : undefined;

  const docs = [];
  let offset = undefined;

  do {
    const response = await client.scroll(collectionName, {
      limit: 256,
      with_payload: true,
      with_vectors: false,
      offset,
      filter: filters,
    });

    const points = response.points || [];
    offset = response.offset;

    for (const point of points) {
      const payload = point.payload || {};
      if (payload.text) {
        docs.push({
          text: payload.text,
          filename: payload.metadata?.filename,
        });
      }
    }
  } while (offset);

  if (!docs.length) {
    return "No documents to summarize.";
  }

  const grouped = docs.reduce((acc, doc) => {
    const key = doc.filename || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc.text);
    return acc;
  }, {});

  const context = Object.entries(grouped)
    .map(([filename, chunks]) => `Document: ${filename}\n${chunks.join("\n\n")}`)
    .join("\n\n");

  const prompt = SUMMARY_PROMPT({ context });

  return generate(model, [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: prompt },
  ]);
}

module.exports = {
  summarizeDocuments,
};
