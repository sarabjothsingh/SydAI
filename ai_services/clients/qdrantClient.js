const { QdrantClient } = require("@qdrant/js-client-rest");
const { getConfig } = require("../config");

let qdrantClient;

function createQdrantClient() {
  if (qdrantClient) {
    return qdrantClient;
  }

  const {
    env: {
      qdrant: { url, apiKey, host, port },
    },
  } = getConfig();

  const options = url
    ? { url, apiKey: apiKey || undefined }
    : { host, port, apiKey: apiKey || undefined, https: false };

  qdrantClient = new QdrantClient(options);
  return qdrantClient;
}

async function ensureCollectionExists(collectionName, vectorSize) {
  const client = createQdrantClient();
  const existingCollections = await client.getCollections();
  const collectionNames = existingCollections.collections?.map((col) => col.name) || [];

  if (!collectionNames.includes(collectionName)) {
    await client.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    });
  }

  const requiredIndexes = [
    { field_name: "metadata.filename", field_schema: { type: "keyword" } },
    { field_name: "metadata.chunk_index", field_schema: { type: "integer" } },
  ];

  for (const indexDefinition of requiredIndexes) {
    try {
      await client.createPayloadIndex(collectionName, indexDefinition, { wait: true });
    } catch (error) {
      const message = error?.data?.status?.error || error?.message || "";
      const alreadyExists = error?.status === 409 || /already exists/i.test(message);
      if (!alreadyExists) {
        throw error;
      }
    }
  }
}

module.exports = {
  getQdrantClient: createQdrantClient,
  ensureCollectionExists,
};
