require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");

//connectDB
const { connect_PgSQL_DB } = require("../src/infrastructure/PgDB/connect");

//routers
const userRouter = require("../src/routers/userRouter");
const roleRouter = require("../src/routers/roleRouter");
const userRoleRouter = require("../src/routers/userRoleRouter");
const pendingChangeRouter = require("../src/routers/pendingChangeRouter");
const userActivityRouter = require("../src/routers/userActivityRouter");
const therapeuticRouter = require("../src/routers/therapeuticRouter");
const drugRouter = require("../src/routers/drugRouter");
const queryRouter = require("../src/routers/queryRouter");
const dropdownManagementRouter = require("../src/routers/dropdownManagementRouter");

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // React default
    "http://localhost:3001", // Alternative React port
    "http://localhost:5173", // Vite default
    "http://localhost:4200", // Angular default
    "http://127.0.0.1:3000", // Alternative localhost format
    "http://127.0.0.1:5173", // Alternative localhost format
    process.env.FRONTEND_URL, // Production frontend URL from env
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null, // Vercel deployment URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

// extra packages
app.use(express.json());
app.use(cors(corsOptions));

// Database connection middleware for serverless
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected && process.env.VERCEL) {
    try {
      await connect_PgSQL_DB(process.env.DATABASE_URL);
      dbConnected = true;
      console.log("Database connected for serverless function");
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ message: "Database connection failed" });
    }
  }
  next();
});

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/user-roles", userRoleRouter);
app.use("/api/v1/pending-changes", pendingChangeRouter);
app.use("/api/v1/user-activity", userActivityRouter);
app.use("/api/v1/therapeutic", therapeuticRouter);
app.use("/api/v1/drugs", drugRouter);
app.use("/api/v1/queries", queryRouter);
app.use("/api/v1/dropdown-management", dropdownManagementRouter);

// basic error handler for tests and dev
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connect_PgSQL_DB(process.env.DATABASE_URL);
    app.listen(port, () =>
      console.log(`TrialByte Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  start();
}

module.exports = app;
module.exports.handler = serverless(app);