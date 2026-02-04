// routes/items.js
const express = require("express");
const router = express.Router();

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemsControllers");

// GET all
router.get("/", getAllItems);

// GET by id
router.get("/:id", getItemById);

// POST create
router.post("/", createItem);

// PUT update
router.put("/:id", updateItem);

// DELETE remove
router.delete("/:id", deleteItem);

module.exports = router;
