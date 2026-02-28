const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const { ensureAuth } = require("../middleware/auth");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoriesController");

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

const validateId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid id format (must be a Mongo ObjectId)"),
  handleValidationErrors
];

const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ max: 80 }).withMessage("name must be 80 chars or less"),

  body("color")
    .notEmpty().withMessage("color is required")
    .isString().withMessage("color must be a string")
    .isLength({ max: 30 }).withMessage("color must be 30 chars or less"),

  body("description")
    .notEmpty().withMessage("description is required")
    .isString().withMessage("description must be a string")
    .isLength({ max: 200 }).withMessage("description must be 200 chars or less"),

  handleValidationErrors
];

const validateUpdateCategory = [
  body().custom((value, { req }) => {
    const allowed = ["name", "color", "description"];
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

  body("color")
    .optional()
    .isString().withMessage("color must be a string")
    .isLength({ max: 30 }).withMessage("color must be 30 chars or less"),

  body("description")
    .optional()
    .isString().withMessage("description must be a string")
    .isLength({ max: 200 }).withMessage("description must be 200 chars or less"),

  handleValidationErrors
];

router.get("/", getAllCategories);
router.get("/:id", validateId, getCategoryById);

router.post("/", ensureAuth, validateCreateCategory, createCategory);
router.put("/:id", ensureAuth, validateId, validateUpdateCategory, updateCategory);
router.delete("/:id", ensureAuth, validateId, deleteCategory);

module.exports = router;
