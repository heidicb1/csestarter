// Import the Express framework
const express = require("express");

// Create an instance of Express Router
const router = new express.Router(); 

// Import the accounts controller module
const accountController = require("../controllers/accountController")

// Import the utilities module
const utilities = require("../utilities")

// Validation
const regValidate = require('../utilities/account-validation')

/* 
 * Login view error handling middleware, controller-based request
 * Route to build login view
 */
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin));

/* 
 * Login view error handling middleware, controller-based request
 * Route to build login view
 */
router.get(
  "/register", 
  utilities.handleErrors(accountController.buildRegister))

/* Post the registration information into the database*/
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request WEEK 5
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route for account management view WEEK 5 ???
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagementView));

// Export the router to make it accessible in other modules
module.exports = router;
