/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/"); // Make sure to replace this with your actual database connection
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");
const errorRoute = require("./routes/errorRoute");
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 * ************************/
// Session middleware using connect-pg-simple to store sessions in PostgreSQL
app.use(
  session({
    // Configure the session store using connect-pg-simple
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true, // Create the session table if it's missing
      pool, // Use the existing database connection pool
    }),
    secret: process.env.SESSION_SECRET, // Secret key for session data encryption
    resave: true, // Forces the session to be saved back to the session store
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
    name: "sessionId", // Name of the cookie to store the session ID
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());

// Custom middleware to make flash messages available in templates
app.use(function (req, res, next) {
  // Make flash messages available in locals for the views
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));

// Index route
// Wrap the call to baseController.buildHome in the handleErrors function
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"));

// Account routes
app.use("/account", require("./routes/accountRoute"));

// Error route
app.use("/error", errorRoute);

//broken route 
app.get('/broken', (req, res, next) => { 
  // Create an error object 
  const err = new Error('This is a simulated error'); 
  // Pass the error to the next middleware 
  next(err); }); 
  

// File Not Found Route - must be the last route in the list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Uh-oh! Gremlins have invaded our code. We've dispatched our team of tech wizards to shoo them away. In the meantime, try refreshing the page or doing a little dance. If that doesn't work, blame it on the office ghost. 👻✨" });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
// Error-handling middleware using async function
app.use(async (err, req, res, next) => {
  // Retrieve navigation data using utility function
  let nav = await utilities.getNav();

  let systemErrorMessage = "Oops! Our server is on strike, demanding better working conditions. We're negotiating with its union of ones and zeros. In the meantime, grab a cup of coffee, contemplate the meaning of life, and check back in a few minutes. Our servers promise to return to their duties shortly! ☕🤖"

  // Log the error details, including the URL where the error occurred
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 500) {
    message = err.message;
  } else if (err.status == 404) {
    message = err.message;
  } else {
    message = systemErrorMessage;
  }
  
  
    
  // Render the error page with relevant details
  res.render("errors/error", {
    title: err.status || "Server Error", // Set the title to the error status or default to 'Server Error'
    message, // Pass the error message to the view
    nav, // Pass navigation data to the view
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
