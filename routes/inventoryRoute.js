// Import the Express framework
const express = require("express");

// Create an instance of Express Router
const router = new express.Router(); 

// Import the inventory controller module
const invController = require("../controllers/invController");

const utilities = require("../utilities");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display the details of a specific inventory item
router.get("/detail/:invId", invController.showItemDetail);

// Add Vehicle Managment Route
router.get("/", invController.buildManagementView); 

// Deliver New Classification View THIS IS GOOD
router.get("/addClassification", utilities.handleErrors(invController.buildaddClassification)); 

//Post New Classification
router.post('/addClassification', utilities.handleErrors(invController.processNewClassification));

// Add New Car
router.get("/newInventory", invController.buildNewInventory); 

// Export the router to make it accessible in other modules
module.exports = router;

