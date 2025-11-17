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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(fn, attempts = 5, delay = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = delay * Math.pow(2, i); // exponential backoff
      console.warn(`[QDRANT] attempt ${i + 1}/${attempts} failed: ${err.message}. Retrying in ${wait}ms`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

function createClient() {
  if (client) return client;

  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;
  const host = process.env.QDRANT_HOST || "localhost";
  const port = Number(process.env.QDRANT_PORT || 6333);

  try {
    if (url) {
      console.info(`[QDRANT] connecting via url=${url}`);
      client = new QdrantClient({ url, apiKey: apiKey || undefined });
    } else {
      console.info(`[QDRANT] connecting via host=${host} port=${port}`);
      client = new QdrantClient({ host, port, apiKey: apiKey || undefined, https: false });
    }
  } catch (err) {
    console.error('[QDRANT] failed to create client', { host, port, url, message: err.message });
    throw err;
  }

  return client;
}

async function ensureCollectionExists(collectionName, vectorSize) {
  const qdrant = createClient();
  try {
    // Try to get collections with retries to handle service startup races
    const existing = await retry(() => qdrant.getCollections(), 5, 1000);
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
  } catch (err) {
    // Detect common network/connectivity failures and provide actionable guidance
    const msg = (err && (err.message || JSON.stringify(err))) || String(err);
    const lowered = msg.toLowerCase();

    console.error('[QDRANT] ensureCollectionExists failed', { collectionName, vectorSize, message: err.message, stack: err.stack });

    if (lowered.includes('fetch failed') || lowered.includes('econnrefused') || lowered.includes('enotfound') || lowered.includes('getaddrinfo')) {
      const host = process.env.QDRANT_HOST || 'localhost';
      const port = process.env.QDRANT_PORT || '6333';
      const hint = `Qdrant appears unreachable at ${host}:${port}. If you're using Docker Compose, start the service: 'docker-compose up -d qdrant database-service' (from the project root). If running locally, ensure Qdrant is running and accessible at http://${host}:${port}.`;
      const err2 = new Error(`${err.message || 'Qdrant connection error'} — ${hint}`);
      err2.original = err;
      throw err2;
    }

    throw err;
  }
}

async function upsertPoints(collectionName, points) {
  const qdrant = createClient();
  try {
    await qdrant.upsert(collectionName, { points, wait: true });
  } catch (err) {
    console.error('[QDRANT] upsert failed', { collectionName, count: points?.length, message: err.message, stack: err.stack });
    throw err;
  }
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
  try {
    await qdrant.delete(collectionName, { filter, wait: true });
  } catch (err) {
    console.error('[QDRANT] delete failed', { collectionName, message: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = {
  ensureCollectionExists,
  upsertPoints,
  searchPoints,
  scrollPoints,
  deletePoints,
};
