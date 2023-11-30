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

// Deliver New Classification View 
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
  router.get("/getInventory/:classification_id", 
  utilities.checkAccountType, // WEEK 5 TASK 2
  utilities.handleErrors(invController.getInventoryJSON))

  //Edit Inventory Route WEEK 5
router.get(
  "/edit/:inv_id", 
  utilities.checkAccountType, // WEEK 5 TASK 2
  utilities.handleErrors(invController.updateInventoryView) 
)

// Route to handle the "POST" request for updating inventory THIS POST REDIRECTS FUNNY
router.post(
  "/update/",
  //invValidate.vehicleRules(), DO I NEED THIS ????
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory) 
  );

  // Delete Inventory Item
  router.get(
    "/delete/:inv_id", 
    //checkAuthorization, WHAT IS THIS ONE NAMED??? LATER IN WEEK?
    utilities.handleErrors(invController.deleteInventoryView) 
  )

    // Delete Inventory Item
    router.post(
      "/delete", 
      //checkAuthorization, WHAT IS THIS ONE NAMED??? LATER IN WEEK?
      utilities.handleErrors(invController.deleteItem) 
    )

  
  // Export the router to make it accessible in other modules
module.exports = router;

