// config/db.js
const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) throw new Error("Missing MONGODB_URI in .env");
  if (!dbName) throw new Error("Missing DB_NAME in .env");

  const client = new MongoClient(uri);

  await client.connect();
  db = client.db(dbName);

  console.log(`✅ Connected to MongoDB database: ${dbName}`);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("DB not initialized. Call connectDB() before getDB().");
  }
  return db;
}

module.exports = { connectDB, getDB };
