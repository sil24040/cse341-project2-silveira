// routes/items.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemsControllers");

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
}

const validateId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid id format (must be a Mongo ObjectId)"),
  handleValidationErrors
];

const validateCreateItem = [
  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ max: 80 }).withMessage("name must be 80 chars or less"),

  body("quantity")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("quantity must be a number >= 0"),

  body("unit")
    .optional({ nullable: true })
    .isString().withMessage("unit must be a string")
    .isLength({ max: 30 }).withMessage("unit must be 30 chars or less"),

  body("category")
    .optional({ nullable: true })
    .isString().withMessage("category must be a string")
    .isLength({ max: 40 }).withMessage("category must be 40 chars or less"),

  body("store")
    .optional({ nullable: true })
    .isString().withMessage("store must be a string")
    .isLength({ max: 40 }).withMessage("store must be 40 chars or less"),

  body("priority")
    .optional({ nullable: true })
    .isIn(["Low", "Medium", "High"]).withMessage("priority must be Low, Medium, or High"),

  body("purchased")
    .optional()
    .isBoolean().withMessage("purchased must be true/false"),

  body("notes")
    .optional({ nullable: true })
    .isString().withMessage("notes must be a string")
    .isLength({ max: 200 }).withMessage("notes must be 200 chars or less"),

  handleValidationErrors
];

const validateUpdateItem = [
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("name cannot be empty")
    .isLength({ max: 80 }).withMessage("name must be 80 chars or less"),

  body("quantity")
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage("quantity must be a number >= 0"),

  body("unit")
    .optional({ nullable: true })
    .isString().withMessage("unit must be a string")
    .isLength({ max: 30 }).withMessage("unit must be 30 chars or less"),

  body("category")
    .optional({ nullable: true })
    .isString().withMessage("category must be a string")
    .isLength({ max: 40 }).withMessage("category must be 40 chars or less"),

  body("store")
    .optional({ nullable: true })
    .isString().withMessage("store must be a string")
    .isLength({ max: 40 }).withMessage("store must be 40 chars or less"),

  body("priority")
    .optional({ nullable: true })
    .isIn(["Low", "Medium", "High"]).withMessage("priority must be Low, Medium, or High"),

  body("purchased")
    .optional()
    .isBoolean().withMessage("purchased must be true/false"),

  body("notes")
    .optional({ nullable: true })
    .isString().withMessage("notes must be a string")
    .isLength({ max: 200 }).withMessage("notes must be 200 chars or less"),

  handleValidationErrors
];

// GET all
router.get("/", getAllItems);

// GET by id
router.get("/:id", validateId, getItemById);

// POST create
router.post("/", validateCreateItem, createItem);

// PUT update
router.put("/:id", validateId, validateUpdateItem, updateItem);

// DELETE remove
router.delete("/:id", validateId, deleteItem);

module.exports = router;