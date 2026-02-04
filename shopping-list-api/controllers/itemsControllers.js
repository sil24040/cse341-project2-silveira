// controllers/itemsControllers.js
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION = "Items"; // your screenshot shows "Items" (capital I)

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET /items
async function getAllItems(req, res) {
  try {
    const db = getDB();
    const items = await db.collection(COLLECTION).find({}).toArray();
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch items" });
  }
}

// GET /items/:id
async function getItemById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();
    const item = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!item) return res.status(404).json({ error: "Item not found" });
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch item" });
  }
}

// POST /items
async function createItem(req, res) {
  try {
    const db = getDB();

    // Basic validation (adjust to your actual fields)
    const {
      name,
      quantity,
      unit,
      category,
      store,
      priority,
      purchased,
      notes
    } = req.body;

    if (!name) return res.status(400).json({ error: "name is required" });

    const newItem = {
      name,
      quantity: quantity ?? null,
      unit: unit ?? null,
      category: category ?? null,
      store: store ?? null,
      priority: priority ?? null,
      purchased: purchased ?? false,
      notes: notes ?? null
    };

    const result = await db.collection(COLLECTION).insertOne(newItem);
    const created = await db
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });

    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create item" });
  }
}

// PUT /items/:id
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();

    // Only allow updates to these fields
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
      return res.status(404).json({ error: "Item not found" });
    }

    const updated = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update item" });
  }
}

// DELETE /items/:id
async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const db = getDB();
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete item" });
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
