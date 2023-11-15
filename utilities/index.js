// Import the inventory model module
const invModel = require("../models/inventory-model");

// Create an object to hold utility functions
const Util = {};

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
        grid += '<li>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          + ' details"><img src="' + vehicle.inv_thumbnail 
          + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          + ' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += '<hr />';
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
  
  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Export the Util object to make the utility function accessible in other modules
module.exports = Util;
