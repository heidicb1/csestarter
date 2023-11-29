// Import the inventory model module
const invModel = require("../models/inventory-model");

// Create an object to hold utility functions
const Util = {};

//WEEK 5
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

// Define a utility function to generate the navigation HTML unordered list
Util.getNav = async function (req, res, next) {
  // Retrieve classification data from the inventory model
  let data = await invModel.getClassifications();

  // Initialize an HTML list with the "Home" link
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // Iterate through each classification data row to build navigation links
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });

  // Close the HTML list
  list += "</ul>";

  // Return the generated navigation HTML
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
// Define a utility function to construct the HTML grid for the classification view
Util.buildClassificationGrid = async function(data){
    // Initialize the grid variable
    let grid;
  
    // Check if there is data to display
    if(data.length > 0){
      // Begin constructing the unordered list with an id of "inv-display"
      grid = '<ul id="inv-display">';
  
      // Iterate through each vehicle in the data and build grid items
      data.forEach(vehicle => { 
        grid += '<li class ="card">';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          + ' details"><img src="' + vehicle.inv_thumbnail 
          + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          + ' on CSE Motors"></a>';
        grid += '<div class="namePrice">';
        grid += '<hr>';
        grid += '<h2>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
        grid += '</h2>';
        grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
        grid += '</div>';
        grid += '</li>';
      });
  
      // Close the unordered list
      grid += '</ul>';
    } else { 
      // Display a notice if no matching vehicles are found
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
  
    // Return the constructed grid
    return grid;
  }
  
/* **************************************
 * Build the item view HTML
 * ************************************ */
// Define a utility function to construct the HTML grid for the item view
Util.buildItemGrid = function(itemDetails) {
  // Initialize the grid variable
  let grid = '<div id="item-display">';

  // Check if there are item details to display
  if (itemDetails) {
      // Build grid items using the provided itemDetails
      grid += '<div class="img-details">';
      grid += '<img src="' + itemDetails.inv_image + '" alt="Image of ' + itemDetails.inv_make + ' ' + itemDetails.inv_model + ' on CSE Motors">';
      grid += '</div>';
      grid += '<div class="details">';
      grid += '<h2>' + itemDetails.inv_make + ' ' + itemDetails.inv_model + '</h2>';
      grid += '<p><strong>Price: $' + new Intl.NumberFormat('en-US').format(itemDetails.inv_price) + '</strong></p>';
      grid += '<p><strong>Description:</strong> ' + itemDetails.inv_description + '</p>';
      grid += '<p><strong>Color:</strong> ' + itemDetails.inv_color + '</p>';
      grid += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(itemDetails.inv_miles) + ' miles</p>';
      grid += '</div>';
  } else {
      // Display a notice if no item details are found
      grid += '<p class="notice">Sorry, no details could be found for this inventory item.</p>';
  }

  // Close the grid
  grid += '</div>';

  // Return the constructed grid
  return grid;
};

/* ************************
 * Build classification dropdown
 ************************** */
Util.getClassification = async function (selectedOption) {
  let data = await invModel.getClassifications()
  let options = `<option value="">Choose a classification</option>`
  data.rows.forEach((row => {
    options += 
      `<option value="${row.classification_id}"
      ${row.classification_id === Number(selectedOption) ? 'selected': ''}>
      ${row.classification_name}
      </option>`
  }))
  return options
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  // Check if the JWT token is present in the request cookies
  if (req.cookies.jwt) {
    // Verify the JWT token using the provided secret key
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        // If there's an error in verifying the token
        if (err) {
          // Flash a message for the user to log in
          req.flash("Please log in");

          // Clear the invalid token cookie
          res.clearCookie("jwt");

          // Redirect the user to the login page
          return res.redirect("/account/login");
        }

        // If the token is successfully verified, store account data in res.locals
        res.locals.accountData = accountData;

        // Set a flag to indicate that the user is logged in
        res.locals.loggedin = 1;

        // Continue to the next middleware or route handler
        next();
      }
    );
  } else {
    // If no JWT token is present, continue to the next middleware or route handler
    next();
  }
};

/* ****************************************
 *  Check Login  WEEK 5
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  console.log("Checking login status...");
  if (res.locals.loggedin) {
    console.log("User is logged in. Proceeding to next middleware.");
    next()
  } else {
    console.log("User is not logged in. Redirecting to login page.");
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Export the Util object to make the utility function accessible in other modules
module.exports = Util;
