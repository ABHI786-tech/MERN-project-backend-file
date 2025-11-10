const {param, body} = require("express-validator")

exports.RegisterUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").toLowerCase(), 
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

//  Login User Validation
exports.LoginUserValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").toLowerCase(),
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

//  Add employee Validation
exports.AddEmployeeValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("image").notEmpty().withMessage("image is required"),
  body("dob").notEmpty().withMessage("date of birth is required"),
  body("mobile").notEmpty().withMessage("mobile number is required"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").toLowerCase(),
  body("role").notEmpty().withMessage("role is required"),
  body("salary").notEmpty().withMessage("salary is required"),
  body("address").notEmpty().withMessage("address is required"),
];



