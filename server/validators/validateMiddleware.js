const { body, validationResult } = require("express-validator");

const nameValidation = (field, label) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ min: 2, max: 100 })
    .withMessage(`${label} must be between 2 and 100 characters`)
    .matches(/^[\p{L}\d][\p{L}\d .,'&()/-]*$/u)
    .withMessage(`${label} contains invalid characters`);

const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email address")
  .normalizeEmail();

const pinValidation = (field, label, requireString = false) => {
  const validator = body(field);

  if (requireString) {
    validator
      .isString()
      .withMessage(`${label} must be a string`)
      .bail();
  }

  return validator
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ min: 4, max: 4 })
    .withMessage(`${label} must be exactly 4 digits`)
    .isNumeric()
    .withMessage(`${label} must contain only digits`);
};

const validateSignup = [
  nameValidation("fullName", "Full name"),
  emailValidation,
  body("matricNumber")
    .trim()
    .notEmpty()
    .withMessage("Matric number is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Matric number must be between 2 and 30 characters")
    .matches(/^[A-Za-z0-9][A-Za-z0-9/_-]*$/)
    .withMessage("Matric number contains invalid characters")
    .toUpperCase(),
  nameValidation("department", "Department"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(?:0\d{10}|\+234\d{10})$/)
    .withMessage("Phone number must be a valid Nigerian phone number"),
  body("level")
    .trim()
    .notEmpty()
    .withMessage("Academic level is required")
    .matches(/^(?:100|200|300|400|500)(?:\s*Level)?$/i)
    .withMessage("Academic level must be 100, 200, 300, 400, or 500"),
  pinValidation("pin", "PIN"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["student", "rep"])
    .withMessage("Role must be either student or rep"),
];

const signinValidation = [
  body("matricNumber")
    .isString()
    .withMessage("Matric number must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Matric number is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Matric number must be between 2 and 30 characters")
    .matches(/^[A-Za-z0-9][A-Za-z0-9/_-]*$/)
    .withMessage("Matric number contains invalid characters")
    .toUpperCase(),
  pinValidation("pin", "PIN", true),
];

const requestPinValidation = [emailValidation];

const resetPinValidation = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only digits"),
  pinValidation("newPin", "New PIN"),
  pinValidation("confirmPin", "Confirm PIN"),
  body("confirmPin").custom((value, { req }) => {
    if (value !== req.body.newPin) {
      throw new Error("New PIN and confirm PIN do not match");
    }
    return true;
  }),
];

const updatePinValidation = [
  pinValidation("currentPin", "Current PIN"),
  pinValidation("newPin", "New PIN"),
  pinValidation("confirmNewPin", "Confirm PIN"),
  body("confirmNewPin").custom((value, { req }) => {
    if (value !== req.body.newPin) {
      throw new Error("New PIN and confirm PIN do not match");
    }
    return true;
  }),
];

const updateProfileValidation = [
  nameValidation("fullName", "Full name"),
  emailValidation,
  body("matricNumber")
    .trim()
    .notEmpty()
    .withMessage("Matric number is required")
    .matches(/^[A-Za-z0-9][A-Za-z0-9/_-]*$/)
    .withMessage("Matric number contains invalid characters")
    .toUpperCase(),
  nameValidation("department", "Department"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(?:0\d{10}|\+234\d{10})$/)
    .withMessage("Phone number must be a valid Nigerian phone number"),
  body("level")
    .trim()
    .notEmpty()
    .withMessage("Academic level is required")
    .matches(/^(?:100|200|300|400|500)(?:\s*Level)?$/i)
    .withMessage("Academic level must be 100, 200, 300, 400, or 500"),
];

const checkErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please correct the highlighted input fields.",
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }

  next();
};

module.exports = {
  validateSignup,
  signinValidation,
  requestPinValidation,
  resetPinValidation,
  updatePinValidation,
  updateProfileValidation,
  checkErrors,
};
