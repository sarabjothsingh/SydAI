require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const Module = require("module");

const extraModulePaths = [
  path.join(__dirname, "node_modules"),
  path.join(__dirname, "..", "node_modules"),
];
extraModulePaths.forEach((modulePath) => {
  if (!Module.globalPaths.includes(modulePath)) {
    Module.globalPaths.push(modulePath);
  }
});

const createAiRouter = require(path.join(__dirname, "..", "ai_services", "routers", "aiRouter"));
const aiRouter = createAiRouter({ express, multer });

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS for Vite dev server
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://127.0.0.1:8081";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Token expiry window (default 1 hour). Override with ACCESS_TOKEN_TTL_MS in .env
const EXPIRES_IN_MS = Number(process.env.ACCESS_TOKEN_TTL_MS || 1000 * 60 * 60);

// Database service URL (standalone service)
const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || "http://127.0.0.1:4000";

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // set true in production when using HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// No direct DB connection here; uses standalone database service

/* ================= GOOGLE STRATEGY ================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const given = profile.name?.givenName || "";
        const family = profile.name?.familyName || "";
        const full = profile.displayName || `${given} ${family}`.trim();
  const now = new Date();
  const expiresAt = new Date(Date.now() + EXPIRES_IN_MS);

        const setFields = {
          provider: "google",
          displayName: profile.displayName,
          firstName: given,
          lastName: family,
          fullName: full,
          emails: profile.emails,
          photos: profile.photos,
          status: "logged_in",
          updatedAt: now,
          "currentSession.accessToken": accessToken,
          "currentSession.refreshToken": refreshToken,
          "currentSession.loggedInAt": now,
          "currentSession.lastActive": now,
          "currentSession.expiresAt": expiresAt,
        };
        const loginHistoryEntry = { loginTime: now, provider: "google", status: "logged_in" };
        const createDoc = {
          provider: "google",
          displayName: profile.displayName,
          firstName: given,
          lastName: family,
          fullName: full,
          emails: profile.emails,
          photos: profile.photos,
          status: "logged_in",
          currentSession: { accessToken, refreshToken, loggedInAt: now, lastActive: now, expiresAt },
        };
        const { data: user } = await axios.post(`${DATABASE_SERVICE_URL}/users/google/upsert`, {
          googleId: profile.id,
          setFields,
          loginHistoryEntry,
          createDoc,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* ================= GITHUB STRATEGY ================= */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const full = profile.displayName || profile.username;
  const now = new Date();
  const expiresAt = new Date(Date.now() + EXPIRES_IN_MS);

        const setFields = {
          provider: "github",
          displayName: profile.displayName || profile.username,
          username: profile.username,
          fullName: full,
          emails: profile.emails,
          photos: profile.photos,
          status: "logged_in",
          updatedAt: now,
          "currentSession.accessToken": accessToken,
          "currentSession.refreshToken": refreshToken,
          "currentSession.loggedInAt": now,
          "currentSession.lastActive": now,
          "currentSession.expiresAt": expiresAt,
        };
        const loginHistoryEntry = { loginTime: now, provider: "github", status: "logged_in" };
        const createDoc = {
          provider: "github",
          displayName: profile.displayName || profile.username,
          username: profile.username,
          fullName: full,
          emails: profile.emails,
          photos: profile.photos,
          status: "logged_in",
          currentSession: { accessToken, refreshToken, loggedInAt: now, lastActive: now, expiresAt },
        };
        const { data: user } = await axios.post(`${DATABASE_SERVICE_URL}/users/github/upsert`, {
          githubId: profile.id,
          setFields,
          loginHistoryEntry,
          createDoc,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const { data: user } = await axios.get(`${DATABASE_SERVICE_URL}/users/${id}`);
    done(null, user);
  } catch (err) {
    // 404 or error -> treat as no user
    done(null, null);
  }
});

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("SydAI Auth Server Running");
});

/* --- GOOGLE ROUTES --- */
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
    accessType: "offline",
    includeGrantedScopes: true,
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const token = req.user?.currentSession?.accessToken;
      setAuthCookie(res, token);
    } catch (_) {}
    return res.redirect(`${CLIENT_ORIGIN}/app`);
  }
);

/* --- GITHUB ROUTES --- */
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const token = req.user?.currentSession?.accessToken;
      setAuthCookie(res, token);
    } catch (_) {}
    return res.redirect(`${CLIENT_ORIGIN}/app`);
  }
);

// Session validation middleware (expiry-aware)
async function checkSession(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ authenticated: false, message: "Not logged in" });
    const sess = req.user.currentSession;
    const now = new Date();

    if (!sess || !sess.expiresAt || new Date(sess.expiresAt) <= now) {
      try {
        await axios.post(`${DATABASE_SERVICE_URL}/sessions/clear-expired`, {
          userId: req.user._id,
          loginTime: sess ? sess.loggedInAt : null,
          provider: req.user.provider || null,
        });
      } catch (e) {
        console.error("Error clearing expired session:", e);
      }

      return req.logout(() => {
        res.clearCookie("accessToken");
        req.session.destroy(() => res.status(401).json({ authenticated: false, message: "Session expired" }));
      });
    }

    // update lastActive (non-blocking)
    axios
      .post(`${DATABASE_SERVICE_URL}/sessions/touch`, { userId: req.user._id })
      .catch((e) => console.error("Error updating lastActive:", e));

    return next();
  } catch (err) {
    console.error("checkSession error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

app.use("/ai", checkSession, aiRouter);

// Status check endpoint (expiry-aware)
app.get("/status", checkSession, (req, res) => {
  res.json({
    authenticated: true,
    provider: req.user.provider,
    firstName: req.user.firstName || req.user.fullName || req.user.displayName,
    expiresAt: req.user.currentSession?.expiresAt || null,
  });
});

// Logout
app.get("/logout", async (req, res) => {
  // Attempt primary logout by userId
  const effectiveUserId = (req.user && req.user._id) || (req.session?.passport?.user) || null;
  const accessTokenCookie = req.cookies?.accessToken;

  async function performDbLogoutByUserId(userId) {
    const loginTime = req.user?.currentSession?.loggedInAt || null;
    const provider = req.user?.provider || null;
    await axios.post(`${DATABASE_SERVICE_URL}/logout`, { userId, loginTime, provider });
  }

  async function performDbLogoutByToken(token) {
    await axios.post(`${DATABASE_SERVICE_URL}/sessions/logout-by-token`, { accessToken: token });
  }

  try {
    if (effectiveUserId) {
      try {
        await performDbLogoutByUserId(effectiveUserId);
      } catch (e1) {
        // Fallback to token-based logout if available
        if (accessTokenCookie) {
          try { await performDbLogoutByToken(accessTokenCookie); } catch (e2) { console.error("Logout fallback (token) failed", e2); }
        } else {
          console.error("Logout by userId failed and no token cookie fallback", e1);
        }
      }
    } else if (accessTokenCookie) {
      // No userId but have token cookie
      try { await performDbLogoutByToken(accessTokenCookie); } catch (e3) { console.error("Logout by token failed", e3); }
    }
  } catch (outerErr) {
    console.error("Unexpected logout error", outerErr);
  }

  req.logout(() => {
    res.clearCookie("accessToken");
    req.session.destroy(() => {
      // Redirect to landing page instead of /login
      res.redirect(`${CLIENT_ORIGIN}/`);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
});

// Helper to set HttpOnly access token cookie
function setAuthCookie(res, token) {
  if (!token) return;
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
}

