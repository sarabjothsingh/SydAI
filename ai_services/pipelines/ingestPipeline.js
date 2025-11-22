const { readFile } = require("fs/promises");
const parsePdf = require("pdf-parse");
const { v4: uuid } = require("uuid");
const { embedTexts } = require("../embeddings/embeddingClient");
const { chunkText } = require("../utils/chunks");
const { ingestDocument, updateDocumentStatus } = require("../clients/databaseClient");
const { DOCUMENT_STATUS } = require("../constants");

async function ingestDocuments({ userId, documents = [] }) {
  if (!userId) {
    throw new Error("ingestDocuments requires userId");
  }
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error("ingestDocuments expects a non-empty array of document descriptors");
  }

  const processedDocuments = [];

  for (const doc of documents) {
    try {
      console.log(`[INGEST] Starting processing for ${doc.filename}`);
      
      const text = await extractText(doc);
      if (!text) {
        console.warn(`[INGEST] No text extracted from ${doc.filename}`);
        continue;
      }
      console.log(`[INGEST] Extracted ${text.length} characters from ${doc.filename}`);
      
      const chunks = await chunkText(text, {
        filename: doc.filename,
        source: doc.source || "upload",
      });

      if (!chunks.length) {
        console.warn(`[INGEST] No chunks created from ${doc.filename}`);
        continue;
      }
      console.log(`[INGEST] Created ${chunks.length} chunks for ${doc.filename}`);

      console.log(`[INGEST] Starting embedding for ${chunks.length} chunks from ${doc.filename}...`);
      const vectors = await embedTexts(chunks.map((chunk) => chunk.text));
      console.log(`[INGEST] Completed embedding for ${doc.filename}`);

      const preparedChunks = chunks.map((chunk, idx) => ({
        id: uuid(),
        vector: vectors[idx],
        text: chunk.text,
        metadata: {
          ...chunk.metadata,
          chunk_index: chunk.metadata?.chunk_index ?? idx,
        },
      }));

      // Basic validation: ensure vectors were produced for all chunks
      if (!Array.isArray(vectors) || vectors.length !== chunks.length) {
        console.error("[INGEST] embedTexts returned invalid vectors", { filename: doc.filename, expected: chunks.length, got: vectors?.length });
        continue;
      }

      const payload = {
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
      };

      console.log(`[INGEST] Storing ${preparedChunks.length} chunks for ${doc.filename} (${payload.document.sizeBytes} bytes)`);
      const response = await ingestDocument(payload);
      if (response?.document) {
        console.log(`[INGEST] Successfully indexed ${doc.filename}`);
        processedDocuments.push(response.document);
      }
    } catch (err) {
      // Surface structured error info from the database client when available
      const errInfo = {
        filename: doc.filename,
        message: err.message,
        status: err.status,
        body: err.body,
        url: err.url,
        stack: err.stack,
      };
      console.error(`[INGEST] Failed to process ${doc.filename}:`, errInfo);
      
      // Update document status to error so it doesn't remain in 'indexing' state
      // NOTE: This could have a race condition if the same document is processed
      // concurrently. For production, consider adding version fields or using a job queue.
      try {
        await updateDocumentStatus({
          userId,
          documentName: doc.filename,
          status: DOCUMENT_STATUS.ERROR,
          errorMessage: err.message || "Failed to process document",
        });
        console.log(`[INGEST] Updated ${doc.filename} status to error`);
      } catch (statusErr) {
        console.error(`[INGEST] Failed to update error status for ${doc.filename}:`, statusErr);
      }
      
      // Continue processing other documents rather than fail-all
      continue;
    }
  }

  console.log(`[INGEST] Completed processing ${processedDocuments.length}/${documents.length} documents`);
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
