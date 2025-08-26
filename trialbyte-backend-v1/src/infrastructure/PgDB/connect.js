const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Retry configuration
const MAX_RETRIES = 5; // max attempts
const INITIAL_DELAY_MS = 2000; // 2 seconds

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connect_PgSQL_DB = async () => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Database connected successfully");

      // Listen for idle client errors
      pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
      });

      return pool; // Connected, exit loop
    } catch (err) {
      attempt++;
      console.error(
        `❌ Database connection failed (attempt ${attempt} of ${MAX_RETRIES}):`,
        err.code || err.message
      );

      if (attempt >= MAX_RETRIES) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      const delay = INITIAL_DELAY_MS * attempt; // exponential-ish backoff
      console.log(`Retrying in ${delay / 1000}s...`);
      await wait(delay);
    }
  }
};

module.exports = { pool, connect_PgSQL_DB };
