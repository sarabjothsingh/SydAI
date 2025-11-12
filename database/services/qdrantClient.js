const { QdrantClient } = require("@qdrant/js-client-rest");
const path = require("path");
const Module = require("module");

const extraModulePaths = [
  path.join(__dirname, "..", "node_modules"),
  path.join(__dirname, "..", "..", "node_modules"),
];
extraModulePaths.forEach((modulePath) => {
  if (!Module.globalPaths.includes(modulePath)) {
    Module.globalPaths.push(modulePath);
  }
});

let client;

function createClient() {
  if (client) return client;

  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;
  const host = process.env.QDRANT_HOST || "localhost";
  const port = Number(process.env.QDRANT_PORT || 6333);

  if (url) {
    client = new QdrantClient({ url, apiKey: apiKey || undefined });
  } else {
    client = new QdrantClient({ host, port, apiKey: apiKey || undefined, https: false });
  }

  return client;
}

async function ensureCollectionExists(collectionName, vectorSize) {
  const qdrant = createClient();
  const existing = await qdrant.getCollections();
  const names = existing.collections?.map((col) => col.name) || [];

  if (!names.includes(collectionName)) {
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    });
  }

  const requiredIndexes = [
    { field_name: "metadata.filename", field_schema: { type: "keyword" } },
    { field_name: "metadata.chunk_index", field_schema: { type: "integer" } },
    { field_name: "metadata.user_id", field_schema: { type: "keyword" } },
  ];

  for (const definition of requiredIndexes) {
    try {
      await qdrant.createPayloadIndex(collectionName, definition, { wait: true });
    } catch (error) {
      const message = error?.data?.status?.error || error?.message || "";
      const alreadyExists = error?.status === 409 || /already exists/i.test(message);
      if (!alreadyExists) {
        throw error;
      }
    }
  }
}

async function upsertPoints(collectionName, points) {
  const qdrant = createClient();
  await qdrant.upsert(collectionName, { points, wait: true });
}

async function searchPoints(collectionName, payload) {
  const qdrant = createClient();
  return qdrant.search(collectionName, payload);
}

async function scrollPoints(collectionName, payload) {
  const qdrant = createClient();
  return qdrant.scroll(collectionName, payload);
}

async function deletePoints(collectionName, filter) {
  const qdrant = createClient();
  await qdrant.delete(collectionName, { filter, wait: true });
}

module.exports = {
  ensureCollectionExists,
  upsertPoints,
  searchPoints,
  scrollPoints,
  deletePoints,
};
