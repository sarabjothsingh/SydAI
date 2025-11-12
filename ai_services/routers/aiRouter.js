const { listModels, findModel } = require("../clients/modelRegistry");
const { ingestDocuments } = require("../pipelines/ingestPipeline");
const { runRagQuery } = require("../pipelines/ragPipeline");
const { summarizeDocuments } = require("../pipelines/summarizationPipeline");
const { getConfig } = require("../config");

module.exports = function createAiRouter({ express, multer }) {
  const upload = multer();
  const router = express.Router();

  router.get("/models", (req, res) => {
    res.json({ models: listModels() });
  });

  router.post("/ingest", upload.array("files"), async (req, res) => {
    try {
      const files = req.files || [];
      if (!files.length) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const documents = files.map((file) => ({
        buffer: file.buffer,
        filename: file.originalname,
        mimetype: file.mimetype,
        source: "upload",
      }));

      await ingestDocuments(documents);
      res.json({ ok: true, ingested: documents.length });
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

      if (!findModel(model)) {
        return res.status(400).json({ message: `Unknown model: ${model}` });
      }

      const result = await runRagQuery({ question, model });
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

      if (!findModel(model)) {
        return res.status(400).json({ message: `Unknown model: ${model}` });
      }

      const summary = await summarizeDocuments({ model, filenames: filenames || [] });
      res.json({ summary });
    } catch (error) {
      console.error("/summarize error", error);
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/health", async (req, res) => {
    try {
      const config = getConfig();
      res.json({
        status: "ok",
        qdrant: Boolean(config.env.qdrant.url || config.env.qdrant.host),
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};
