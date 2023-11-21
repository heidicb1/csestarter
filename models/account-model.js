// Import the database connection pool from the "../database/" module
const pool = require("../database/");

/* *****************************
 * Register new account in the database
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        // SQL query to insert a new account record into the 'account' table
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";

        // Execute the SQL query using the pool and provided parameters
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);

        // Return the result of the query (inserted account data)
        return result;
    } catch (error) {
        // If an error occurs during the database operation, return the error message
        return error.message;
    }
}

module.exports = { registerAccount }
