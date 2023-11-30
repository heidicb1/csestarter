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
invCont.buildManagementView = async function (req, res, next) {
    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();
    const classificationSelect =  await utilities.getClassification() // WEEK 5
      res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
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

  const { classification_name } = req.body

  const classificationResult = await invModel.processNewClassification(
    classification_name
  )

  let nav = await utilities.getNav()

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
    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();
    let classificationDropDown = await utilities.getClassification()
    // Render the inventory item detail view with the title, navigation, and grid data
    res.render("./inventory/add-inventory", {
      title: "New Inventory",
      nav,
      classificationDropDown,
      errors: null,
    });
  }

/* ****************************************
*  Process New Inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationDropDown= await utilities.getClassification()
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body


  console.log("i got data!", classification_id, inv_make, inv_model, inv_year, inv_description,
   inv_image, inv_thumbnail)
  const regResult = await invModel.addInventory(
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color
  )

  if (regResult) {
    req.flash(
      "notice",
      "Vehicle added"
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationDropDown,
    })
  } else {
    req.flash("error", "Vehicle addition failed")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationDropDown,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON WEEK 5
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);

    if (invData.length > 0) {
      return res.json(invData);
    } else {
      return res.status(404).json({ error: "No data returned" });
    }
  } catch (error) {
    console.error("Error in getInventoryJSON:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ***************************
 *  Build the Update Inventory View with Data WEEK 5
 * ************************** */
invCont.updateInventoryView = async function (req, res, next) {
  try {
    // Extract the inventory ID from the URL parameter
    const inv_id = parseInt(req.params.inv_id);

    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();

    // Fetch details of the inventory item based on inv_id
    const itemData = await invModel.getInventoryItemDetailsById(inv_id);

    // Fetch classification options for the dropdown
    let classificationSelect = await utilities.getClassification(itemData.classification_id);

    // Generate a string representing the item name
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    // Render the edit-inventory view with the retrieved data
    res.render("./inventory/editInventoryView", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    });
  } catch (error) {
    console.error("Error in updateInventoryView:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Process Update Inventory View with Data WEEK 5
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    console.log('updateResult:', updateResult);

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      // Fetch classification options for the dropdown
      const classificationSelect = await utilities.getClassification(classification_id);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect
      });
    } else {
      req.flash("error", "Vehicle update failed");
      res.status(501).render("./inventory/editInventoryView", {
        title: "Edit " + itemName, 
        nav,
        errors: null,
      });
    }
  } catch (error) {
    // Add console log to check for errors
    console.error('Error in updateInventory:', error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Build the Delete Inventory View with Data WEEK 5
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    // Extract the inventory ID from the URL parameter
    const inv_id = parseInt(req.params.inv_id);

    // Retrieve navigation data using utility function
    let nav = await utilities.getNav();

    // Fetch details of the inventory item based on inv_id
    const itemData = await invModel.getInventoryItemDetailsById(inv_id);

    // Generate a string representing the item name
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    // Render the delete-inventory view with the retrieved data
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      classification_id: itemData.classification_id 
    });
  } catch (error) {
    console.error("Error in DeleteInventoryView:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Update Delete Inventory View with Data WEEK 5
 * ************************** */
invCont.deleteItem = async function (req, res, next){
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventory(inv_id)
  if (deleteResult) {
    req.flash(
      "notice",
      "The deletion was successful"
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav
    })
  } else {
    req.flash("error", "Vehicle deletion failed")
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete Vehicle",
      nav,
      errors: null
    })
  }
} 

// Export the invCont object to make the controller functions accessible in other modules
module.exports = invCont;

