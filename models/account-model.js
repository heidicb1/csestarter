// Import the database connection pool from the "../database/" module
const pool = require("../database/");

//WEEK 5
const bcrypt = require("bcryptjs");

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

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for user email
 * ********************* */
async function checkUserEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address WEEK 5
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **********************
 *   Check password WEEK 5
 * ********************* */
async function checkPassword(account_email, account_password) {
  try {
      const sql = "SELECT * FROM account WHERE account_email = $1";
      const result = await pool.query(sql, [account_email]);

      if (result.rows.length > 0) {
          const storedPassword = result.rows[0].account_password;
          // Compare the provided password with the stored hashed password
          return await bcrypt.compare(account_password, storedPassword);
      }

      return false; // No matching email found
  } catch (error) {
      throw error;
  }
}


module.exports = {
    registerAccount,
    checkExistingEmail,
    checkUserEmail,
    getAccountByEmail, 
    checkPassword
 }
