const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION = "Categories";

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

async function getAllCategories(req, res) {
  try {
    const db = getDB();
    const categories = await db.collection(COLLECTION).find({}).toArray();
    return res.status(200).json(categories);
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();
    const category = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!category) return res.status(404).json({ error: "Category not found" });
    return res.status(200).json(category);
  } catch (err) {
    console.error("getCategoryById error:", err);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
}

async function createCategory(req, res) {
  try {
    const db = getDB();
    const { name, color, description } = req.body;

    const newCategory = {
      name,
      color: color ?? null,
      description: description ?? null,
      createdAt: new Date()
    };

    const result = await db.collection(COLLECTION).insertOne(newCategory);
    const created = await db.collection(COLLECTION).findOne({ _id: result.insertedId });

    return res.status(201).json(created);
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ error: "Failed to create category" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();

    const allowed = ["name", "color", "description"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updated = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({ error: "Failed to update category" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ error: "Failed to delete category" });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
