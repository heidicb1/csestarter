const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build/Deliver inventory by classification view
 * ************************** */

// Define a controller function to handle building the inventory view by classification
invCont.buildByClassificationId = async function (req, res, next) {
  //Error Handling
  try {
    // Extract the classification_id parameter from the URL
    const classification_id = req.params.classificationId;

    // Retrieve inventory data based on the classification_id
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    // Check if the inventory data is empty or invalid
    if (!data || data.length === 0) {
      return res
        .status(404)
        .send("Inventory data not found for the specified classification");
    }

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
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Build item view
 * ************************** */

// Controller function to handle displaying the details of a specific inventory item
invCont.showItemDetail = async function (req, res) {
  //Error Handling
  try {
    // Extract the inv_id parameter from the URL
    const invId = req.params.invId;

    // Fetch inventory item details based on invId
    const itemDetails = await invModel.getInventoryItemDetailsById(invId);

    // Check if the inventory item exists
    if (!itemDetails) {
      return res.status(404).send("Inventory item not found");
    }

    // Build a grid representation of the inventory item (modify as needed)
    const grid = utilities.buildItemGrid(itemDetails);

    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();

    // Extract the item name for use in the view
    const itemName =
      itemDetails.inv_year +
      " " +
      itemDetails.inv_make +
      " " +
      itemDetails.inv_model;

    // Render the inventory item detail view with the title, navigation, and grid data
    res.render("./inventory/item-detail-view", {
      title: itemName,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error in showItemDetail:", error);
    res.status(500).send("Internal Server Error");
  }
};


/* ***************************
 *  Build mamangement view
 * ************************** */
invCont.buildManagementView = async function (req, res) {
    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  }

/* ***************************
 *  Build/Deliver New Classification WORKS
 * ************************** */
invCont.buildaddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  // View add-calssification.ejs
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
 invCont.processNewClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.processNewClassification(
    classification_name
  )

  if (classificationResult) {
    req.flash(
      "notice",
      `Congratulations, classification ${classification_name} was added to the database.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}
  

/* ***************************
 *  Build New Inventory
 * ************************** */
invCont.buildNewInventory = async function (req, res, next) {
  try {
    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();
    
    // Render the inventory item detail view with the title, navigation, and grid data
    res.render("./inventory/add-inventory", {
      title: "New Inventory",
      nav
    });
  } catch (error) {
    console.error("Error in buildNewInventory:", error);
    res.status(500).send("Internal Server Error");
  };
}

/* ***************************
 *  Process New Inventory
 * ************************** */

// Export the invCont object to make the controller functions accessible in other modules
module.exports = invCont;

