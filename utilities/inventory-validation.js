const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Class Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
    .trim()
    .isLength({ min: 3 })
    .isAlpha()
    .withMessage("Please use only letters in the name")
    .custom(async (classification_name) => {
      const classificationExists = await invModel.checkExistingClassification(classification_name)
      if (classificationExists){
        throw new Error("Classification already exists")
      }
    }),
  ]
}

/* ******************************
 * Check class data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Add New Inventory Rules
 * ********************************* */
validate.vehicleRules = () => {

  return [
    body("classification_id")
    .isNumeric()
    .withMessage('Please select a classification'),

    body("inv_make")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Make must be longer than 2 characters"),

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be longer than 3 characters"),

    body("inv_description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Please provide a description"),

    body("inv_image")
    .trim()
    .matches(/^\/images\/vehicles\/[a-zA-Z0-9\-_]+\.([a-zA-Z]{3,4})$/)
    .withMessage("Please provide an image path ex.\/images\/vehicles\/example.png"),

    body("inv_thumbnail")
    .trim()
    .matches(/^\/images\/vehicles\/[a-zA-Z0-9\-_]+\.([a-zA-Z]{3,4})$/)
    .withMessage("Please provide an thumbnail image path ex.\/images\/vehicles\/example.png"),

    body("inv_price")
    .trim()
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Please input valid price"),

    body("inv_year")
    .trim()
    .isNumeric({ no_symbols: true })
    .withMessage("4-digit year")
    .isLength({ min: 4, max: 4 }),

    body("inv_miles")
    .trim()
    .isNumeric({ no_symbols: true })
    .withMessage("Please input miles without commas or decimals"),

    body("inv_color")
    .trim()
    .isAlpha()
    .withMessage("Please provide a valid color"),
  ]
}

/* ******************************
 * New Inventory Validation
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {

    console.log("sticky", errors);
    let nav = await utilities.getNav()
    let classificationDropDown = await utilities.getClassification(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationDropDown,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * New Inventory Validation WEEK 5
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {

    console.log("sticky", errors);
    let nav = await utilities.getNav()
    let classificationDropDown = await utilities.getClassification(classification_id)
    res.render("./inventory/editInventoryView", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationDropDown,
      inv_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}
  
  module.exports = validate
