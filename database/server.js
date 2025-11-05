// Standalone Database CRUD Service
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Models
const User = require("./schemas/user");

const app = express();
app.use(express.json());

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
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ [DB] Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ [DB] MongoDB connection error:", err);
    process.exit(1);
  });

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Basic read by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
    console.error("[DB] google upsert error:", err);
    res.status(500).json({ message: "Server error" });
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
    console.error("[DB] github upsert error:", err);
    res.status(500).json({ message: "Server error" });
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
    console.error("[DB] touch error:", err);
    res.status(500).json({ message: "Server error" });
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
    console.error("[DB] clear-expired error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Explicit logout
app.post("/logout", async (req, res) => {
  try {
    const { userId, loginTime = null, provider = null } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const now = new Date();
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: { status: "logged_out", "currentSession.lastActive": now, updatedAt: now },
        $push: {
          loginHistory: { logoutTime: now, loginTime: loginTime || null, provider: provider || null, status: "logged_out" },
        },
        $unset: { currentSession: "" },
      },
      { new: true }
    );
    res.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[DB] logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 [DB] CRUD service listening on http://localhost:${PORT}`));
