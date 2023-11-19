// Import the utilities module
const utilities = require("../utilities/");

// Create an empty object to serve as the base controller
const baseController = {};

// Define a method to build the home page
baseController.buildHome = async function(req, res) {
  try {
    // Retrieve navigation information using the imported utility function
    const nav = await utilities.getNav();
    
    // Add a test flash message to req
    // req.flash('notice', 'This is a flash message.');

    // Render the "index" view with a title of "Home" and the retrieved navigation data
    res.render("index", { title: "Home", nav });
  } catch (error) {
    // Error Handling
    console.error("Error in buildHome:", error);
    res.status(500).send("Internal Server Error"); // *Reminder* Can change what the error outputs
  }
};

// Export the base controller object so it is accessible in other modules
module.exports = baseController;
