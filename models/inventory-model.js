// Import the database connection pool from the "../database/" module
const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */

// Define an asynchronous function to fetch all classification data from the database
async function getClassifications() {
  // Execute a SQL query to select all classifications from the "public.classification" table, ordered by classification name
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

// Export the function to make it accessible in other modules
module.exports = {getClassifications, getInventoryByClassificationId};
