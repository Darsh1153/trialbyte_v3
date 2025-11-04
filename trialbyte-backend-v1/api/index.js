require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");

//connectDB
const { connect_PgSQL_DB } = require("./src/infrastructure/PgDB/connect");

//routers
const userRouter = require("./src/routers/userRouter");
const roleRouter = require("./src/routers/roleRouter");
const userRoleRouter = require("./src/routers/userRoleRouter");
const pendingChangeRouter = require("./src/routers/pendingChangeRouter");
const userActivityRouter = require("./src/routers/userActivityRouter");
const therapeuticRouter = require("./src/routers/therapeuticRouter");
const drugRouter = require("./src/routers/drugRouter");
const queryRouter = require("./src/routers/queryRouter");
const dropdownManagementRouter = require("./src/routers/dropdownManagementRouter");

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000", // React default
      "http://localhost:3001", // Alternative React port
      "http://localhost:5173", // Vite default
      "http://localhost:4200", // Angular default
      "http://127.0.0.1:3000", // Alternative localhost format
      "http://127.0.0.1:5173", // Alternative localhost format
      process.env.FRONTEND_URL, // Production frontend URL from env
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
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
  maxAge: 600, // Cache preflight response for 10 minutes
};

// extra packages
app.use(express.json());

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

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

const port = process.env.PORT || 5002;

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

if (process.env.NODE_ENV !== "test") {
  start();
}

module.exports = app;
module.exports.handler = serverless(app);