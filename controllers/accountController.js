const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
// WEEK 5
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // Deliver the login view
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver Management View WEEK 5
 * ************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  // Deliver the login view
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
  });
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request WEEK 5
 * ************************************ */
async function accountLogin(req, res) {
  try {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    // Check if an account with the provided email exists
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      // If no account is found, render login page with an error message
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    try {
      // Compare the provided password with the hashed password in the database
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        // If passwords match, create a JWT token and set it in a cookie
        // This token can be used for authentication in subsequent requests
        delete accountData.account_password; // Remove sensitive data before signing
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

        // Redirect to the account management page
        return res.redirect("/account/accountManagement");
      }
    } catch (error) {
      // Handle any errors that may occur during the password comparison
      console.error('Error comparing passwords:', error);
      return new Error('Access Forbidden');
    }
  } catch (error) {
    // Handle any errors that may occur during the login process
    console.error('Error in accountLogin:', error);
    res.status(500).send('Internal Server Error');
  }
}




module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView
 }
