// Import the utilities module for additional functions
const utilities = require("../utilities/");

// Create an empty object to serve as the base controller
const baseController = {};

// Define a method to build the home page
baseController.buildHome = async function(req, res) {
  // Retrieve navigation data using a utility function
  const nav = await utilities.getNav();
  
  // Render the "index" view with a title of "Home" and the retrieved navigation data
  res.render("index", { title: "Home", nav });
};

// Export the base controller object to make it accessible in other modules
module.exports = baseController;
