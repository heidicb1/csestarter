// Import the Express framework
const express = require("express");

// Create an instance of Express Router
const router = new express.Router(); 

// Import the accounts controller module
const accountController = require("../controllers/accountController")

// Import the utilities module
const utilities = require("../utilities")

/* 
 * Login view error handling middleware, controller-based request
 * Route to build login view
 */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* 
 * Login view error handling middleware, controller-based request
 * Route to build login view
 */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* Post the registarion information into the database*/
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Export the router to make it accessible in other modules
module.exports = router;
