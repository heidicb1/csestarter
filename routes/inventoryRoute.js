// Import the Express framework
const express = require("express");

// Create an instance of Express Router
const router = new express.Router(); 

// Import the inventory controller module
const invController = require("../controllers/invController");

const utilities = require("../utilities");

const classificationValidate = require('../utilities/inventory-validation')
const invValidate = require('../utilities/inventory-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display the details of a specific inventory item
router.get("/detail/:invId", invController.showItemDetail);

// Add Vehicle Managment Route
router.get("/", invController.buildManagementView); 

// Deliver New Classification View THIS IS GOOD
router.get("/addClassification", utilities.handleErrors(invController.buildaddClassification)); 

//Post New Classification
router.post('/addClassification', 
classificationValidate.classificationRules(),
classificationValidate.checkClassificationData,
utilities.handleErrors(invController.processNewClassification));

// Add New Inventory
router.get("/newInventory", invController.buildNewInventory); 

//Post New Inventory
router.post(
    "/newInventory",
    invValidate.vehicleRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory),
  )

  //Account Managment Classification Edit WEEK 5
  router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

  // Export the router to make it accessible in other modules
module.exports = router;

