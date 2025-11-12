const { generate } = require("../clients/llmFactory");
const { getConfig } = require("../config");
const { scrollVectors } = require("../clients/databaseClient");

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

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

async function summarizeDocuments({ model, filenames = [], userId }) {
  if (!model) throw new Error("summarizeDocuments requires a model");
  if (!userId) throw new Error("summarizeDocuments requires userId");

  const { models } = getConfig();
  const modelConfig = models.find((item) => item.id === model || item.display_name === model);

  const summaryTokenLimit = modelConfig?.summary_token_limit ?? 8000;
  const summaryOverlapTokens = modelConfig?.summary_overlap_tokens ?? 400;
  const modelId = modelConfig?.id || model;

  const scrollResponse = await scrollVectors({
    userId,
    filenames,
    limit: 256,
  });

  const docs = [];
  for (const point of scrollResponse?.points || []) {
    const payload = point?.payload || {};
    const metadata = payload.metadata || {};
    if (payload.text) {
      docs.push({
        text: payload.text,
        filename: metadata.filename || "Unknown",
      });
    }
  }

  if (!docs.length) {
    return "No documents available for summarization.";
  }

  const maxTokensPerBatch = Math.max(400, summaryTokenLimit - summaryOverlapTokens);

  const segments = docs.map((doc) => ({
    filename: doc.filename,
    text: doc.text,
    tokens: estimateTokens(doc.text),
  }));

  const batches = [];
  let currentBatch = { tokens: 0, segments: [] };

  for (const segment of segments) {
    const segmentTokens = Math.max(1, segment.tokens);
    const wouldOverflow = currentBatch.tokens + segmentTokens > maxTokensPerBatch;

    if (segmentTokens > maxTokensPerBatch) {
      if (currentBatch.segments.length) {
        batches.push(currentBatch);
        currentBatch = { tokens: 0, segments: [] };
      }
      batches.push({ tokens: segmentTokens, segments: [segment] });
      continue;
    }

    if (wouldOverflow && currentBatch.segments.length) {
      batches.push(currentBatch);
      currentBatch = { tokens: 0, segments: [] };
    }

    currentBatch.segments.push(segment);
    currentBatch.tokens += segmentTokens;
  }

  if (currentBatch.segments.length) {
    batches.push(currentBatch);
  }

  const batchSummaries = [];

  for (const batch of batches) {
    const context = batch.segments
      .map((segment) => `Document: ${segment.filename}\n${segment.text}`)
      .join("\n\n");

    const prompt = SUMMARY_PROMPT({ context });

    const summary = await generate(modelId, [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]);

    batchSummaries.push((summary || "").trim());
  }

  const filteredSummaries = batchSummaries.filter((item) => item.length);
  if (!filteredSummaries.length) {
    return "Summary could not be generated.";
  }

  if (filteredSummaries.length === 1) {
    return filteredSummaries[0];
  }

  const aggregatePrompt = `System role: You consolidate partial summaries into a cohesive final report.

Combine the following partial summaries into a single, well-structured summary. Remove duplication, maintain document attributions when clear, and preserve critical figures, dates, and responsibilities. Output concise bullet sections similar to the earlier format.

Partial summaries:
${filteredSummaries
  .map((summary, index) => `Summary ${index + 1}:\n${summary}`)
  .join("\n\n")}

Now produce the final merged summary:`;

  const aggregateSummary = await generate(modelId, [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: aggregatePrompt },
  ]);

  return (aggregateSummary || "").trim();
}

module.exports = {
  summarizeDocuments,
};
