// routes/items.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const { ensureAuth } = require("../middleware/auth");

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemsControllers");

// helper to show validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
}

// validate MongoId
const validateId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid id format (must be a Mongo ObjectId)"),
  handleValidationErrors
];

// ✅ CREATE: validate ALL fields (professor feedback)
const validateCreateItem = [
  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ max: 80 }).withMessage("name must be 80 chars or less"),

  body("quantity")
    .notEmpty().withMessage("quantity is required")
    .isFloat({ min: 0 }).withMessage("quantity must be a number >= 0"),

  body("unit")
    .notEmpty().withMessage("unit is required")
    .isString().withMessage("unit must be a string")
    .isLength({ max: 30 }).withMessage("unit must be 30 chars or less"),

  body("category")
    .notEmpty().withMessage("category is required")
    .isString().withMessage("category must be a string")
    .isLength({ max: 40 }).withMessage("category must be 40 chars or less"),

  body("store")
    .notEmpty().withMessage("store is required")
    .isString().withMessage("store must be a string")
    .isLength({ max: 40 }).withMessage("store must be 40 chars or less"),

  body("priority")
    .notEmpty().withMessage("priority is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("priority must be Low, Medium, or High"),

  body("purchased")
    .notEmpty().withMessage("purchased is required")
    .isBoolean().withMessage("purchased must be true/false"),

  body("notes")
    .notEmpty().withMessage("notes is required")
    .isString().withMessage("notes must be a string")
    .isLength({ max: 200 }).withMessage("notes must be 200 chars or less"),

  handleValidationErrors
];

// ✅ UPDATE: optional fields (but validate if present)
// Also ensures request isn't empty
const validateUpdateItem = [
  body().custom((value, { req }) => {
    const allowed = [
      "name",
      "quantity",
      "unit",
      "category",
      "store",
      "priority",
      "purchased",
      "notes"
    ];
    const keys = Object.keys(req.body || {});
    const hasAllowed = keys.some((k) => allowed.includes(k));
    if (!hasAllowed) throw new Error("No valid fields to update");
    return true;
  }),

  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("name cannot be empty")
    .isLength({ max: 80 }).withMessage("name must be 80 chars or less"),

  body("quantity")
    .optional()
    .isFloat({ min: 0 }).withMessage("quantity must be a number >= 0"),

  body("unit")
    .optional()
    .isString().withMessage("unit must be a string")
    .isLength({ max: 30 }).withMessage("unit must be 30 chars or less"),

  body("category")
    .optional()
    .isString().withMessage("category must be a string")
    .isLength({ max: 40 }).withMessage("category must be 40 chars or less"),

  body("store")
    .optional()
    .isString().withMessage("store must be a string")
    .isLength({ max: 40 }).withMessage("store must be 40 chars or less"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("priority must be Low, Medium, or High"),

  body("purchased")
    .optional()
    .isBoolean().withMessage("purchased must be true/false"),

  body("notes")
    .optional()
    .isString().withMessage("notes must be a string")
    .isLength({ max: 200 }).withMessage("notes must be 200 chars or less"),

  handleValidationErrors
];

// Routes
router.get("/", getAllItems);
router.get("/:id", validateId, getItemById);

// If you want POST protected too, add ensureAuth here.
// router.post("/", ensureAuth, validateCreateItem, createItem);
router.post("/", ensureAuth, validateCreateItem, createItem);

// ✅ protect PUT + DELETE (matches screenshot/rubric idea)
router.put("/:id", ensureAuth, validateId, validateUpdateItem, updateItem);
router.delete("/:id", ensureAuth, validateId, deleteItem);

module.exports = router;