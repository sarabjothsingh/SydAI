// Standalone Database CRUD Service
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Models
const User = require("./schemas/user");
const Document = require("./schemas/document");
const { DOCUMENT_STATUS } = require("./constants");

// Services
const {
  ensureCollectionExists,
  upsertPoints,
  searchPoints,
  scrollPoints,
  deletePoints,
} = require("./services/qdrantClient");

const app = express();
// Allow larger JSON payloads so chunked embeddings (vectors) are not rejected
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Allow calls from auth server origin if provided (optional)
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN;
if (ALLOW_ORIGIN) {
  app.use(
    cors({
      origin: ALLOW_ORIGIN,
      credentials: false,
    })
  );
}

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sydai";
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || "SYD-ai";
const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM || 1024);
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [DB] Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ [DB] MongoDB connection error:", err);
    process.exit(1);
  });

const isProd = process.env.NODE_ENV === "production";
function sendError(res, err, tag = "[DB]") {
  // Log full error server-side for debugging
  console.error(tag, err);
  const status = (err && err.status) || 500;
  const body = { message: isProd ? "Server error" : (err && err.message) || "Server error" };
  if (!isProd && err && err.stack) {
    body.stack = err.stack;
  }
  return res.status(status).json(body);
}

function buildUserFilter(userId) {
  return {
    must: [
      {
        key: "metadata.user_id",
        match: { value: String(userId) },
      },
    ],
  };
}

// Health
app.get("/health", (req, res) => res.json({ ok: true }));
// List documents for a user
app.get("/documents", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const documents = await Document.find({ userId }).sort({ updatedAt: -1 }).lean();
    res.json({ documents });
  } catch (err) {
    return sendError(res, err, "[DB] list documents error:");
  }
});

// Get indexing status for user's documents
app.get("/documents/status", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const documents = await Document.find({ userId }, { 
      name: 1, 
      status: 1, 
      progress: 1, 
      chunkCount: 1,
      errorMessage: 1,
      updatedAt: 1
    }).sort({ updatedAt: -1 }).lean();
    
    // Optimize: calculate all status counts in a single pass
    const summary = documents.reduce((acc, doc) => {
      acc.total++;
      if (doc.status === DOCUMENT_STATUS.INDEXED) acc.indexed++;
      else if (doc.status === DOCUMENT_STATUS.INDEXING) acc.indexing++;
      else if (doc.status === DOCUMENT_STATUS.PENDING) acc.pending++;
      else if (doc.status === DOCUMENT_STATUS.ERROR) acc.error++;
      return acc;
    }, { total: 0, indexed: 0, indexing: 0, pending: 0, error: 0 });
    
    res.json({ documents, summary });
  } catch (err) {
    return sendError(res, err, "[DB] get status error:");
  }
});

// Ingest document chunks into Qdrant and persist metadata
app.post("/documents/ingest", async (req, res) => {
  try {
    const { userId, document } = req.body || {};
    const { name, sizeBytes = 0, chunkCount, chunks = [], metadata = {} } = document || {};

    if (!userId || !name || !Array.isArray(chunks) || chunks.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Basic validation of chunk vectors
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      if (!Array.isArray(c.vector) || c.vector.length === 0) {
        throw new Error(`Invalid or missing vector for chunk index ${i}`);
      }
      if (c.vector.length !== EMBEDDING_DIM) {
        // warn but allow: some embedding providers vary dims; still surface as info
        console.warn(`[DB] chunk vector dimension mismatch for ${name} index ${i}: expected=${EMBEDDING_DIM} got=${c.vector.length}`);
      }
    }

    await ensureCollectionExists(QDRANT_COLLECTION, EMBEDDING_DIM);

    const now = new Date();
    const points = chunks.map((chunk) => ({
      id: chunk.id,
      vector: chunk.vector,
      payload: {
        text: chunk.text,
        metadata: {
          ...chunk.metadata,
          filename: chunk.metadata?.filename || name,
          user_id: String(userId),
        },
      },
    }));

    await deletePoints(QDRANT_COLLECTION, {
      must: [
        { key: "metadata.user_id", match: { value: String(userId) } },
        { key: "metadata.filename", match: { value: name } },
      ],
    });

    await upsertPoints(QDRANT_COLLECTION, points);

    const documentRecord = await Document.findOneAndUpdate(
      { userId, name },
      {
        $set: {
          sizeBytes: Number(sizeBytes) || 0,
          chunkCount: chunkCount ?? chunks.length,
          status: DOCUMENT_STATUS.INDEXED,
          progress: 100,
          errorMessage: null,
          metadata,
          lastProcessedAt: now,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ ok: true, document: documentRecord });
  } catch (err) {
    return sendError(res, err, "[DB] ingest document error:");
  }
});

// Delete a document and its vectors
app.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const document = await Document.findOneAndDelete({ _id: id, userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await ensureCollectionExists(QDRANT_COLLECTION, EMBEDDING_DIM);
    await deletePoints(QDRANT_COLLECTION, {
      must: [
        { key: "metadata.user_id", match: { value: String(userId) } },
        { key: "metadata.filename", match: { value: document.name } },
      ],
    });

    res.json({ ok: true });
  } catch (err) {
    return sendError(res, err, "[DB] delete document error:");
  }
});

// Vector similarity search scoped to user
app.post("/vectors/search", async (req, res) => {
  try {
    const { userId, vector, limit = 10, filter = {} } = req.body || {};
    if (!userId || !Array.isArray(vector)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    await ensureCollectionExists(QDRANT_COLLECTION, EMBEDDING_DIM);

    const userFilter = buildUserFilter(userId);
    const combinedFilter = {
      must: [...(userFilter.must || []), ...(filter.must || [])],
    };

    const results = await searchPoints(QDRANT_COLLECTION, {
      vector,
      limit,
      with_payload: true,
      filter: combinedFilter,
    });

    res.json({ matches: results });
  } catch (err) {
    return sendError(res, err, "[DB] vector search error:");
  }
});

// Retrieve vectors (scroll) scoped to user and optional filenames
app.post("/vectors/scroll", async (req, res) => {
  try {
    const { userId, filenames = [], limit = 256 } = req.body || {};
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    await ensureCollectionExists(QDRANT_COLLECTION, EMBEDDING_DIM);

    const filterMust = buildUserFilter(userId).must;
    if (Array.isArray(filenames) && filenames.length) {
      filterMust.push({ key: "metadata.filename", match: { any: filenames } });
    }

    const points = [];
    let offset = undefined;

    do {
      const response = await scrollPoints(QDRANT_COLLECTION, {
        limit,
        offset,
        with_payload: true,
        with_vectors: false,
        filter: { must: filterMust },
      });

      if (Array.isArray(response.points)) {
        points.push(...response.points);
      }
      offset = response.offset;
    } while (offset);

    res.json({ points });
  } catch (err) {
    return sendError(res, err, "[DB] vector scroll error:");
  }
});

// Basic read by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    return sendError(res, err, "[DB] user read error:");
  }
});

// Upsert by Google ID (CRUD only)
app.post("/users/google/upsert", async (req, res) => {
  try {
    const { googleId, setFields, loginHistoryEntry, createDoc } = req.body;
    if (!googleId || !setFields || !loginHistoryEntry || !createDoc)
      return res.status(400).json({ message: "Invalid payload" });

    let user = await User.findOne({ googleId });
    if (user) {
      user = await User.findByIdAndUpdate(
        user._id,
        { $set: setFields, $push: { loginHistory: loginHistoryEntry } },
        { new: true }
      );
    } else {
      user = await User.create({ googleId, ...createDoc, loginHistory: [loginHistoryEntry] });
    }
    res.json(user);
  } catch (err) {
    return sendError(res, err, "[DB] google upsert error:");
  }
});

// Upsert by GitHub ID (CRUD only)
app.post("/users/github/upsert", async (req, res) => {
  try {
    const { githubId, setFields, loginHistoryEntry, createDoc } = req.body;
    if (!githubId || !setFields || !loginHistoryEntry || !createDoc)
      return res.status(400).json({ message: "Invalid payload" });

    let user = await User.findOne({ githubId });
    if (user) {
      user = await User.findByIdAndUpdate(
        user._id,
        { $set: setFields, $push: { loginHistory: loginHistoryEntry } },
        { new: true }
      );
    } else {
      user = await User.create({ githubId, ...createDoc, loginHistory: [loginHistoryEntry] });
    }
    res.json(user);
  } catch (err) {
    return sendError(res, err, "[DB] github upsert error:");
  }
});

// Touch lastActive
app.post("/sessions/touch", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const now = new Date();
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { "currentSession.lastActive": now, updatedAt: now } },
      { new: true }
    );
    res.json({ ok: true, user: updated });
  } catch (err) {
    return sendError(res, err, "[DB] touch error:");
  }
});

// Clear expired session (mark logged_out, push history, unset session)
app.post("/sessions/clear-expired", async (req, res) => {
  try {
    const { userId, loginTime = null, provider = null } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const now = new Date();
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: { status: "logged_out", updatedAt: now },
        $push: {
          loginHistory: { logoutTime: now, loginTime: loginTime || null, provider: provider || null, status: "logged_out" },
        },
        $unset: { currentSession: "" },
      },
      { new: true }
    );
    res.json({ ok: true, user: updated });
  } catch (err) {
    return sendError(res, err, "[DB] clear-expired error:");
  }
});

// Explicit logout
app.post("/logout", async (req, res) => {
  try {
    const { userId, loginTime = null, provider = null } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const now = new Date();
    // Clear session atomically without conflicting nested updates
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: { status: "logged_out", updatedAt: now },
        $push: {
          loginHistory: { logoutTime: now, loginTime: loginTime || null, provider: provider || null, status: "logged_out" },
        },
        $unset: { currentSession: "" },
      },
      { new: true }
    );
    res.json({ ok: true, user: updated });
  } catch (err) {
    return sendError(res, err, "[DB] logout error:");
  }
});

// Logout by accessToken cookie value (fallback when userId not available)
app.post("/sessions/logout-by-token", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: "accessToken required" });
    const user = await User.findOne({ "currentSession.accessToken": accessToken });
    if (!user) return res.status(404).json({ message: "User not found for token" });

    const now = new Date();
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { status: "logged_out", updatedAt: now },
        $push: {
          loginHistory: { logoutTime: now, loginTime: user.currentSession?.loggedInAt || null, provider: user.provider || null, status: "logged_out" },
        },
        $unset: { currentSession: "" },
      },
      { new: true }
    );
    res.json({ ok: true, user: updated });
  } catch (err) {
    return sendError(res, err, "[DB] logout-by-token error:");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 [DB] CRUD service listening on http://localhost:${PORT}`));
