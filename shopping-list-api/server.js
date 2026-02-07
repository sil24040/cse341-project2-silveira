// server.js
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { connectDB } = require("./config/db");

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (open policy)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Health check
app.get("/", (req, res) => res.status(200).send("API is running ✅"));

// Swagger UI (dynamic server URL so Try it Out works on Render + local)
app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
  const host = req.get("host");
  const scheme = req.headers["x-forwarded-proto"] || req.protocol;

  const spec = JSON.parse(JSON.stringify(swaggerDocument));
  spec.servers = [{ url: `${scheme}://${host}` }];

  return swaggerUi.setup(spec)(req, res, next);
});

// Routes
app.use("/items", require("./routes/items"));

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });
