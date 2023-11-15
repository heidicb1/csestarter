// Comments:
// - This controller function is responsible for handling requests to build the inventory view based on classification.
// - It extracts the classification_id from the request parameters.
// - Retrieves inventory data for the specified classification_id using the inventory model.
// - Uses utility functions to build a grid representation of the inventory and retrieve navigation data.
// - Renders the inventory view with the title, navigation, and grid data.

// Import the inventory model module
const invModel = require("../models/inventory-model");

// Import the utilities module
const utilities = require("../utilities/");

// Create an object to hold inventory-related controller functions
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */

// Define a controller function to handle building the inventory view by classification
invCont.buildByClassificationId = async function (req, res, next) {
  // Extract the classification_id parameter from the URL
  const classification_id = req.params.classificationId;

  // Retrieve inventory data based on the classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id);

  // Build a grid representation of the inventory using utility function
  const grid = await utilities.buildClassificationGrid(data);

  // Retrieve navigation data using utility function
  let nav = await utilities.getNav();

  // Extract the classification name for use in the view
  const className = data[0].classification_name;

  // Render the inventory view with the title, navigation, and grid data
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
}

// Export the invCont object to make the controller functions accessible in other modules
module.exports = invCont;

