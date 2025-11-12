const fs = require("fs");
const path = require("path");

let cachedConfig;

function getEnvVar(key, { required = false, fallback } = {}) {
  const value = process.env[key];
  if ((value === undefined || value === "") && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value !== undefined && value !== "" ? value : fallback;
}

function resolveModelsConfigPath() {
  const explicitPath = process.env.MODEL_REGISTRY_PATH;
  if (explicitPath && fs.existsSync(explicitPath)) {
    return explicitPath;
  }

  const candidatePaths = [
    path.resolve(process.cwd(), "modelssyd.config.json"),
    path.resolve(__dirname, "..", "modelssyd.config.json"),
    path.resolve(__dirname, "..", "..", "modelssyd.config.json"),
    path.resolve(__dirname, "..", "..", "..", "modelssyd.config.json"),
  ];

  const foundPath = candidatePaths.find((candidate) => fs.existsSync(candidate));
  if (!foundPath) {
    throw new Error(
      `modelssyd.config.json not found. Searched paths: ${candidatePaths.join("; ")}`
    );
  }

  return foundPath;
}

function loadModelRegistry() {
  const filePath = resolveModelsConfigPath();
  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse modelssyd.config.json: ${err.message}`);
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("modelssyd.config.json must contain a non-empty array of model definitions");
  }
  parsed.forEach((model, index) => {
    ["display_name", "type", "id"].forEach((field) => {
      if (!model[field]) {
        throw new Error(`Model entry at index ${index} is missing required field '${field}'`);
      }
    });
  });
  return parsed;
}

function buildConfig() {
  if (cachedConfig) return cachedConfig;

  const groqApiKey = getEnvVar("GROQ_API_KEY");
  const googleApiKey = getEnvVar("GOOGLE_API_KEY");
  const ollamaBaseUrl = getEnvVar("OLLAMA_BASE_URL", { fallback: "http://localhost:11434" });
  const embeddingServiceUrl = getEnvVar("EMBEDDING_SERVICE_URL", { fallback: "http://localhost:8001" });

  const qdrantUrl = getEnvVar("QDRANT_URL");
  const qdrantApiKey = getEnvVar("QDRANT_API_KEY");
  const qdrantHost = getEnvVar("QDRANT_HOST", { fallback: "localhost" });
  const qdrantPort = Number(getEnvVar("QDRANT_PORT", { fallback: 6333 }));
  const qdrantCollection = getEnvVar("QDRANT_COLLECTION", { fallback: "embeddings_bgem3" });
  const embeddingDim = Number(getEnvVar("EMBEDDING_DIM", { fallback: 1024 }));

  const modelRegistry = loadModelRegistry();

  cachedConfig = {
    models: modelRegistry,
    env: {
      groqApiKey,
      googleApiKey,
      ollamaBaseUrl,
      embeddingServiceUrl,
      qdrant: {
        url: qdrantUrl,
        apiKey: qdrantApiKey,
        host: qdrantHost,
        port: qdrantPort,
        collectionName: qdrantCollection,
        vectorSize: embeddingDim,
      },
    },
  };

  return cachedConfig;
}

function getModelByDisplayName(displayName) {
  const { models } = buildConfig();
  return models.find((model) => model.display_name === displayName) || null;
}

function getModelById(id) {
  const { models } = buildConfig();
  return models.find((model) => model.id === id) || null;
}

module.exports = {
  getConfig: buildConfig,
  getModelByDisplayName,
  getModelById,
};
