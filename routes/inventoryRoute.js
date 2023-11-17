// Import the Express framework
const express = require("express");

// Create an instance of Express Router
const router = new express.Router(); 

// Import the inventory controller module
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display the details of a specific inventory item
router.get("/detail/:invId", invController.showItemDetail);

// Export the router to make it accessible in other modules
module.exports = router;

