// Import the Pool class from the "pg" library for PostgreSQL connection pooling
const { Pool } = require("pg");

// Load environment variables from a .env file
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// Initialize a variable to hold the connection pool
let pool;

// Check if the environment is in development
if (process.env.NODE_ENV == "development") {
  // Create a connection pool with SSL configuration for local testing
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // SSL configuration for local testing
    },
  });

  // Added for troubleshooting queries during development

  // Export an object with a query function for executing SQL queries
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    },
  };
} else {
  // Create a connection pool without SSL configuration for production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Export the connection pool for non-development environments
  module.exports = pool;
}
