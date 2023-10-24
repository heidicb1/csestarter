// Import the Express framework
const express = require('express');

// Create an instance of an Express router
const router = express.Router();

// Static Routes
// Set up a "public" folder and its subfolders for serving static files

// Serve files from the "public" folder and its subfolders
router.use(express.static("public"));

// Serve CSS files from the "public/css" folder
router.use("/css", express.static(__dirname + "public/css"));

// Serve JavaScript files from the "public/js" folder
router.use("/js", express.static(__dirname + "public/js"));

// Serve image files from the "public/images" folder
router.use("/images", express.static(__dirname + "public/images"));

// Export the router so that it can be used in other parts of your application
module.exports = router;



