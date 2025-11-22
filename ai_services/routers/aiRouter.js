const { listModels, findModel } = require("../clients/modelRegistry");
const { ingestDocuments } = require("../pipelines/ingestPipeline");
const { runRagQuery } = require("../pipelines/ragPipeline");
const { summarizeDocuments } = require("../pipelines/summarizationPipeline");
const {
  listDocuments: listUserDocuments,
  getDocumentsStatus,
  deleteDocument: deleteUserDocument,
} = require("../clients/databaseClient");
const { getConfig } = require("../config");

module.exports = function createAiRouter({ express, multer }) {
  const upload = multer();
  const router = express.Router();

  router.get("/models", (req, res) => {
    res.json({ models: listModels() });
  });

  router.get("/documents", async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const response = await listUserDocuments(userId);
      res.json({ documents: response?.documents || [] });
    } catch (error) {
      console.error("/documents error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/documents/status", async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const response = await getDocumentsStatus(userId);
      res.json(response);
    } catch (error) {
      console.error("/documents/status error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/ingest", upload.array("files"), async (req, res) => {
    try {
      const files = req.files || [];
      if (!files.length) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const documents = files.map((file) => ({
        buffer: file.buffer,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        source: "upload",
      }));

  const ingested = await ingestDocuments({ userId, documents });
  res.json({ ok: true, ingested: ingested.length, documents: ingested });
    } catch (error) {
      console.error("/ingest error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/query", async (req, res) => {
    try {
      const { question, model } = req.body || {};
      if (!question || !model) {
        return res.status(400).json({ message: "question and model are required" });
      }

      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      if (!findModel(model)) {
        return res.status(400).json({ message: `Unknown model: ${model}` });
      }

      const result = await runRagQuery({ question, model, userId });
      res.json(result);
    } catch (error) {
      console.error("/query error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/summarize", async (req, res) => {
    try {
      const { model, filenames } = req.body || {};
      if (!model) {
        return res.status(400).json({ message: "model is required" });
      }

      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      if (!findModel(model)) {
        return res.status(400).json({ message: `Unknown model: ${model}` });
      }

      // Check if all documents are indexed before summarizing
      const statusResponse = await getDocumentsStatus(userId);
      const documents = statusResponse?.documents || [];
      
      // Filter documents based on filenames if provided
      const relevantDocs = filenames && filenames.length > 0
        ? documents.filter(doc => filenames.includes(doc.name))
        : documents;
      
      // Check if any documents are still indexing
      const indexingDocs = relevantDocs.filter(doc => doc.status === "indexing" || doc.status === "pending");
      if (indexingDocs.length > 0) {
        return res.status(400).json({ 
          message: "Some documents are still being indexed. Please wait for indexing to complete.",
          indexing: indexingDocs.map(d => d.name)
        });
      }
      
      // Check if there are any indexed documents to summarize
      const indexedDocs = relevantDocs.filter(doc => doc.status === "indexed");
      if (indexedDocs.length === 0) {
        return res.status(400).json({ 
          message: "No indexed documents available for summarization. Please upload and index documents first."
        });
      }

      const summary = await summarizeDocuments({ model, filenames: filenames || [], userId });
      res.json({ summary });
    } catch (error) {
      console.error("/summarize error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.delete("/documents/:id", async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      await deleteUserDocument({ documentId: req.params.id, userId });
      res.json({ ok: true });
    } catch (error) {
      console.error("/documents delete error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/health", async (req, res) => {
    try {
      const config = getConfig();
      res.json({
        status: "ok",
        databaseService: config.env.databaseServiceUrl,
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};
