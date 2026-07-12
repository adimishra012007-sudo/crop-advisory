import { body, validationResult } from "express-validator";

/**
 * Formats express-validator results into a clean, flat key-value dictionary
 * matching the frontend's expected error details format.
 */
const formatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = {};
    errors.array().forEach((err) => {
      const field = err.path || err.param;
      if (!details[field]) {
        details[field] = err.msg;
      }
    });
    return res.status(400).json({
      error: "Validation Error",
      details,
    });
  }
  next();
};

// Signup validation rule set
export const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email address."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required."),
  body("phone")
    .optional(),
  body("location")
    .optional(),
  formatValidationErrors,
];

// Login validation rule set
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email address."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required."),
  formatValidationErrors,
];

// Crop creation/update validation rule set
export const cropValidation = [
  body("cropName")
    .trim()
    .notEmpty()
    .withMessage("Crop name is required."),
  body("season")
    .trim()
    .notEmpty()
    .withMessage("Season is required."),
  body("soilType")
    .trim()
    .notEmpty()
    .withMessage("Soil type is required."),
  formatValidationErrors,
];
