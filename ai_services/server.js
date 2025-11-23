// AI Gateway Microservice - Standalone Service
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");

const createAiRouter = require(path.join(__dirname, "routers", "aiRouter"));

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration
const ALLOW_ORIGINS = (process.env.ALLOW_ORIGINS || "http://localhost:3000,http://localhost:8081").split(",");
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOW_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Middleware to verify user session from auth server
async function verifySession(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const cookie = req.headers.cookie;
    
    if (!authHeader && !cookie) {
      return res.status(401).json({ message: "Unauthorized - No credentials provided" });
    }

    // Forward session verification to auth server
    const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3000";
    
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/status`, {
        headers: {
          cookie: cookie || "",
          authorization: authHeader || "",
        },
        timeout: 5000,
      });

      if (response.data.authenticated) {
        // Attach user info to request
        req.user = {
          _id: response.data.userId || response.data._id,
          firstName: response.data.firstName,
          provider: response.data.provider,
        };
        return next();
      }
    } catch (verifyError) {
      console.error("Session verification failed:", verifyError.message);
      return res.status(401).json({ message: "Unauthorized - Invalid session" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Create AI router with dependencies
const aiRouter = createAiRouter({ express, multer });

// Health check endpoint (no auth required)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "ai-gateway",
    timestamp: new Date().toISOString(),
  });
});

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

// Mount AI routes with authentication
app.use("/ai", verifySession, aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [AI Gateway] Service running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Auth Service: ${process.env.AUTH_SERVICE_URL || "http://localhost:3000"}`);
  console.log(`   Database Service: ${process.env.DATABASE_SERVICE_URL || "http://localhost:4000"}`);
  console.log(`   Embedding Service: ${process.env.EMBEDDING_SERVICE_URL || "http://localhost:8001"}`);
});
