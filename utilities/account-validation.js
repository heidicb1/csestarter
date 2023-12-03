const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
body("account_email")
.trim()
.isEmail()
.normalizeEmail() // refer to validator.js docs
.withMessage("A valid email is required.")
.custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists){
    throw new Error("Email exists. Please log in or use different email")
  }
}),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check registration data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  // Destructure the relevant fields from the request body
  const { account_firstname, account_lastname, account_email } = req.body;

  // Initialize an array to store validation errors
  let errors = [];

  // Use the validationResult function to check for validation errors
  errors = validationResult(req);

  // Check if there are validation errors
  if (!errors.isEmpty()) {
    // If there are errors, get navigation data
    let nav = await utilities.getNav();

    // Render the "account/register" view with error messages and form data
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });

    // Return to prevent further processing if there are errors
    return;
  }

  // If there are no validation errors, continue to the next middleware or route
  next();
};

  
  /* **********************************
 * Login Data Validation Rules WEEK 5
 * ********************************* */
validate.loginRules = () => {
  return [
    // Valid email is required
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),

    // Password is required
    body('account_password')
      .trim()
      .notEmpty()
      .withMessage('Password is required.'),
  ];
};

/* ******************************
 * Check login data and return errors or continue to login WEEK 5
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;

  // Get the array of errors directly
  const errors = validationResult(req).array();

  // Check if the email exists in the database
  const emailExists = await accountModel.checkExistingEmail(account_email);
  if (!emailExists) {
    errors.push({ msg: 'Invalid email or password.' });
  } else {
    // If the email exists, check if the provided password is valid
    const isValidPassword = await accountModel.checkPassword(account_email, account_password);
    if (!isValidPassword) {
      errors.push({ msg: 'Invalid email or password.' });
    }
  }

  // If there are errors, render the login view with error messages and form data
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });

    // Return to prevent further processing if there are errors
    return;
  }

  // If there are no errors, continue to the next middleware or route
  next();
};

/*  **********************************
 *  account UPDATE rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ]
}

/*  **********************************
 *  CHANGEPASSWORD Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to EDITACCOUNT
 * ***************************** */
validate.checkEditAccountData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const account = await accountModel.getAccountById(account_id)
  if (account_email != account.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      errors.push("Email exists. Please log in or use different email")
    }
  }
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("./account/editaccount", {
      errors,
      title: "Edit Account Information",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


module.exports = validate;