// swagger.js
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Shopping List API",
    description: "CSE341 Project 2 - Shopping List API",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local dev" }
    // Render server is injected dynamically in server.js, so you don't need to hardcode it here.
  ],
};

const outputFile = "./swagger.json";

// IMPORTANT: include BOTH server.js and routes so it picks up your docs
const endpointsFiles = ["./server.js", "./routes/items.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ swagger.json generated");
});