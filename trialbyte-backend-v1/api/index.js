require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

/* =========================
   CORS — SINGLE SOURCE
========================= */

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:4200",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL,
      "https://trialbyte-frontend-v1-eta.vercel.app",
    ].filter(Boolean);

    const vercelRegex = /^https:\/\/.*\.vercel\.app$/i;

    // Allow non-browser and preflight
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (vercelRegex.test(origin)) {
      return callback(null, true);
    }

    // ❗ DO NOT THROW
    return callback(null, false);
  },

  credentials: true,
  optionsSuccessStatus: 200,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "Pragma",
    "X-CSRF-Token",
  ],

  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
};

/* =========================
   CORS MUST BE FIRST
========================= */

// Explicit preflight handler - ensures headers are always set
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  console.log("[CORS] Preflight request from:", origin);
  
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:4200",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
    "https://trialbyte-frontend-v1-eta.vercel.app",
  ].filter(Boolean);
  
  const vercelRegex = /^https:\/\/.*\.vercel\.app$/i;
  
  let isAllowed = false;
  if (!origin) {
    isAllowed = true;
  } else if (allowedOrigins.includes(origin)) {
    isAllowed = true;
  } else if (vercelRegex.test(origin)) {
    isAllowed = true;
  } else if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
    const extra = process.env.ADDITIONAL_ALLOWED_ORIGINS.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (extra.includes(origin)) {
      isAllowed = true;
    }
  }
  
  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, X-CSRF-Token");
    res.setHeader("Access-Control-Max-Age", "600");
    console.log("[CORS] Preflight allowed for:", origin);
  } else {
    console.error("[CORS] Preflight blocked for:", origin);
  }
  
  res.status(200).end();
});

app.use(cors(corsOptions));

/* =========================
   BODY PARSING
========================= */

app.use(express.json());

/* =========================
   NORMALIZE DOUBLE SLASHES
========================= */

app.use((req, res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/([^:]\/)\/+/g, "$1");
  }
  next();
});

/* =========================
   EDGE STORE
========================= */

const { registerEdgeStoreRoutes } = require("../src/utils/edgeStore");
registerEdgeStoreRoutes(app);

/* =========================
   DATABASE
========================= */

const {
  connect_PgSQL_DB,
} = require("../src/infrastructure/PgDB/connect");

let dbConnectionPromise = null;

const ensureDbConnection = async () => {
  if (dbConnectionPromise) return dbConnectionPromise;

  try {
    const { pool } = require("../src/infrastructure/PgDB/connect");
    await pool.query("SELECT 1");
    return pool;
  } catch {}

  dbConnectionPromise = (async () => {
    return connect_PgSQL_DB();
  })();

  return dbConnectionPromise;
};

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   DB MIDDLEWARE
========================= */

app.use("/api", async (req, res, next) => {
  if (req.path === "/health") return next();

  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

/* =========================
   ROUTERS
========================= */

app.use("/api/v1/users", require("../src/routers/userRouter"));
app.use("/api/v1/roles", require("../src/routers/roleRouter"));
app.use("/api/v1/user-roles", require("../src/routers/userRoleRouter"));
app.use("/api/v1/pending-changes", require("../src/routers/pendingChangeRouter"));
app.use("/api/v1/user-activity", require("../src/routers/userActivityRouter"));
app.use("/api/v1/therapeutic", require("../src/routers/therapeuticRouter"));
app.use("/api/v1/drugs", require("../src/routers/drugRouter"));
app.use("/api/v1/queries", require("../src/routers/queryRouter"));
app.use("/api/v1/dropdown-management", require("../src/routers/dropdownManagementRouter"));

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* =========================
   SERVER / SERVERLESS
========================= */

const port = process.env.PORT || 5002;

if (process.env.NODE_ENV !== "test") {
  connect_PgSQL_DB(process.env.DATABASE_URL)
    .then(() => {
      app.listen(port, () =>
        console.log(`🚀 TrialByte Server running on port ${port}`)
      );
    })
    .catch(console.error);
}

module.exports = app;
module.exports.handler = serverless(app);
