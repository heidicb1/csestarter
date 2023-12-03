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
    errors: null,
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
  // Deliver the mamagement view
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
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
    console.log("Step 1: Entering accountLogin function");
    
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Check if an account with the provided email exists
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      console.log("Step 2: No account found. Rendering login page with error message.");
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
        console.log("Step 3: Passwords match. Creating JWT token and setting it in a cookie.");
        // If passwords match, create a JWT token and set it in a cookie
        // This token can be used for authentication in subsequent requests
        delete accountData.account_password; // Remove sensitive data before signing
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

        // Redirect to the account management page
        console.log("Step 4: Redirecting to accountManagement page.");
        return res.redirect("/account"); ////?????THIS IS THE ISSUE
      }
    } catch (error) {
      // Handle any errors that may occur during the password comparison
      console.error('Step 5: Error comparing passwords:', error);
      return new Error('Access Forbidden');
    }
  } catch (error) {
    // Handle any errors that may occur during the login process
    console.error('Step 6: Error in accountLogin:', error);
    res.status(500).send('Internal Server Error');
  }
}

/* ****************************************
 * Deliver the view for editing account information
 * *************************************** */
async function buildEditAccount(req, res, next) {
  // Fetch navigation data
  let nav = await utilities.getNav();

  // Retrieve account data from the response locals
  let account = res.locals.accountData;

  // Extract account ID from the request parameters
  const account_id = parseInt(req.params.account_id);

  // Render the edit account information view with necessary data
  res.render("account/editaccount", {
    title: "Edit Account Information",
    nav,
    errors: null, // If you get rid of this you will recever the Server error page
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id
  });
}


/* ****************************************
 * Process updated account information (POST /editaccount)
 * *************************************** */
async function editAccountInfo(req, res) {
  // Fetch navigation data
  let nav = await utilities.getNav();

  // Extract account information from the request body
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  // Attempt to update the account information in the database
  const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id);

  // Check if the update was successful
  if (updateResult) {
    // Clear the existing JWT cookie
    res.clearCookie("jwt");

    // Retrieve the updated account data from the database
    const accountData = await accountModel.getAccountById(account_id);

    // Generate a new JWT access token with updated account information
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

    // Set the new JWT access token as an HTTP-only cookie with a maximum age of 1 hour
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

    // Flash a success message and render the account view
    req.flash("notice", `Congratulations, ${account_firstname} you've successfully updated your account info.`);
    res.status(201).render("account/accountManagement", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  } else {
    // Flash an error message and render the account edit view again
    req.flash("error", "Sorry, the update failed.");
    res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 * Process updated account password (POST /editpassword)
 * *************************************** */
async function editAccountPassword(req, res) {
  // Fetch navigation data
  let nav = await utilities.getNav();

  // Extract password and account ID from the request body
  const { account_password, account_id } = req.body;

  // Hash the provided password before storing it
  let hashedPassword;
  try {
    // Hash the password with a cost factor of 10 (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    // Handle errors during password hashing
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/editaccount", {
      title: "Edit Account Password",
      nav,
      errors: null,
    });
    return; // Exit the function early in case of an error
  }

  // Attempt to update the account password in the database
  const passwordUpdateResult = await accountModel.changeAccountPassword(hashedPassword, account_id);

  // Retrieve the updated account data
  const updatedAccount = await accountModel.getAccountById(account_id);

  // Check if the password update was successful
  if (passwordUpdateResult) {
    // Flash a success message and render the account view
    req.flash("notice", `Congratulations, ${updatedAccount.account_firstname} you've successfully updated your password.`);
    res.status(201).render("account/accountManagement", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: updatedAccount.account_firstname,
    });
  } else {
    // Flash an error message and render the account edit view again
    req.flash("error", "Sorry, the password update failed.");
    res.status(501).render("account/editaccount", {
      title: "Edit Account Password",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Logout user
* *************************************** */
async function logoutUser(req, res, next) {
  res.clearCookie('jwt')
  res.redirect("/")
  return}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView, 
  buildEditAccount,
  editAccountInfo,
  editAccountPassword,
  logoutUser
 }
