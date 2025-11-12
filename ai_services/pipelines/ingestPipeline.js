const { readFile } = require("fs/promises");
const parsePdf = require("pdf-parse");
const { v4: uuid } = require("uuid");
const { embedTexts } = require("../embeddings/embeddingClient");
const { chunkText } = require("../utils/chunks");
const { ingestDocument } = require("../clients/databaseClient");

async function ingestDocuments({ userId, documents = [] }) {
  if (!userId) {
    throw new Error("ingestDocuments requires userId");
  }
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error("ingestDocuments expects a non-empty array of document descriptors");
  }

  const processedDocuments = [];

  for (const doc of documents) {
    const text = await extractText(doc);
    if (!text) continue;
    const chunks = await chunkText(text, {
      filename: doc.filename,
      source: doc.source || "upload",
    });

    if (!chunks.length) continue;

    const vectors = await embedTexts(chunks.map((chunk) => chunk.text));

    const preparedChunks = chunks.map((chunk, idx) => ({
      id: uuid(),
      vector: vectors[idx],
      text: chunk.text,
      metadata: {
        ...chunk.metadata,
        chunk_index: chunk.metadata?.chunk_index ?? idx,
      },
    }));

    const response = await ingestDocument({
      userId,
      document: {
        name: doc.filename,
        sizeBytes: doc.buffer?.length || doc.size || 0,
        chunkCount: preparedChunks.length,
        metadata: {
          source: doc.source || "upload",
          mimetype: doc.mimetype,
        },
        chunks: preparedChunks,
      },
    });

    if (response?.document) {
      processedDocuments.push(response.document);
    }
  }

  return processedDocuments;
}

async function extractText(doc) {
  const buffer = doc.buffer || (doc.path ? await readFile(doc.path) : null);
  if (!buffer) return "";

  const filename = (doc.filename || "").toLowerCase();
  const mimetype = doc.mimetype || "";

  if (mimetype === "application/pdf" || filename.endsWith(".pdf")) {
    try {
      const { text } = await parsePdf(buffer);
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (error) {
      console.error("Failed to parse PDF", doc.filename, error);
    }
  }

  return buffer.toString("utf-8");
}

module.exports = {
  ingestDocuments,
};
