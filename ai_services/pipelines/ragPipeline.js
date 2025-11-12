const { getConfig } = require("../config");
const { getQdrantClient, ensureCollectionExists } = require("../clients/qdrantClient");
const { embedTexts } = require("../embeddings/embeddingClient");
const { generate } = require("../clients/llmFactory");

const QA_PROMPT = ({ context, question }) => `System role: You are a precise technical analyst. Prefer accuracy over speculation. When unsure, state uncertainty.

Answer the user's question using the provided context. Follow these rules:
1) Use ONLY the information in the provided context blocks. If the answer is not present, reply exactly: "Answer is not available in the context."
2) Cite sources inline:
   - For internal docs, cite as (filename, page X) when relevant.
   - For web snippets (if present), cite as [web].
3) Prefer bullet points or concise paragraphs; use tables for structured data.
4) Include key thresholds/figures verbatim from the source when applicable.
5) Do not include private data from memory; only use the supplied context.

Context blocks:
${context}

User question:
${question}

Your answer:`;

async function runRagQuery({ question, model, topK = 10 }) {
  if (!question || !model) {
    throw new Error("runRagQuery requires both question and model");
  }

  const config = getConfig();
  const collectionName = config.env.qdrant.collectionName;
  const client = getQdrantClient();

  // Guarantee the target collection exists before attempting a search.
  await ensureCollectionExists(collectionName, config.env.qdrant.vectorSize);

  const [questionVector] = await embedTexts([question]);

  const search = await client.search(collectionName, {
    vector: questionVector,
    limit: topK,
    with_payload: true,
  });

  const contexts = (search || [])
    .map((item) => {
      const payload = item.payload || {};
      const meta = payload.metadata || {};
      const filename = meta.filename ? `(${meta.filename})` : "";
      return `---\n${payload.text || ""}\n${filename}`;
    })
    .join("\n\n");

  const prompt = QA_PROMPT({ context: contexts || "No context", question });

  const answer = await generate(model, [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: prompt },
  ]);

  return {
    answer,
    matches: search || [],
  };
}

module.exports = {
  runRagQuery,
};
