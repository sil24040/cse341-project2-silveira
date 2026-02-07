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
router.get(
  "/",
  /* #swagger.tags = ['Items']
     #swagger.summary = 'Get all items'
     #swagger.responses[200] = { description: 'OK' }
  */
  getAllItems
);

// GET by id
router.get(
  "/:id",
  /* #swagger.tags = ['Items']
     #swagger.summary = 'Get an item by ID'
     #swagger.parameters['id'] = { description: 'Mongo ObjectId', required: true }
     #swagger.responses[200] = { description: 'OK' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
  getItemById
);

// POST create
router.post(
  "/",
  /* #swagger.tags = ['Items']
     #swagger.summary = 'Create a new item'
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["name"],
             properties: {
               name: { type: "string", example: "Milk" },
               quantity: { type: "number", example: 2 },
               unit: { type: "string", example: "gallon" },
               category: { type: "string", example: "Dairy" },
               store: { type: "string", example: "Walmart" },
               priority: { type: "string", example: "High" },
               purchased: { type: "boolean", example: false },
               notes: { type: "string", example: "2% preferred" }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Created' }
     #swagger.responses[400] = { description: 'Bad Request' }
  */
  createItem
);

// PUT update
router.put(
  "/:id",
  /* #swagger.tags = ['Items']
     #swagger.summary = 'Update an item by ID'
     #swagger.parameters['id'] = { description: 'Mongo ObjectId', required: true }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               name: { type: "string", example: "Milk" },
               quantity: { type: "number", example: 1 },
               unit: { type: "string", example: "gallon" },
               category: { type: "string", example: "Dairy" },
               store: { type: "string", example: "Costco" },
               priority: { type: "string", example: "Low" },
               purchased: { type: "boolean", example: true },
               notes: { type: "string", example: "Bought already" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Updated' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
  updateItem
);

// DELETE remove
router.delete(
  "/:id",
  /* #swagger.tags = ['Items']
     #swagger.summary = 'Delete an item by ID'
     #swagger.parameters['id'] = { description: 'Mongo ObjectId', required: true }
     #swagger.responses[204] = { description: 'Deleted' }
     #swagger.responses[404] = { description: 'Not Found' }
  */
  deleteItem
);

module.exports = router;
