// swagger.js
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Shopping List API",
    description: "CSE341 Project 2 – Shopping List API with OAuth authentication",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server"
    }
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description: "Session cookie from Google OAuth login"
      }
    },

    schemas: {
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          color: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },

      Item: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          quantity: { type: "number" },
          unit: { type: "string" },
          category: { type: "string" },
          store: { type: "string" },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"]
          },
          purchased: { type: "boolean" },
          notes: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },

      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" }
        }
      }
    }
  }
};

const outputFile = "./swagger.json";

const endpointsFiles = [
  "./server.js",
  "./routes/items.js",
  "./routes/categories.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ swagger.json generated");
});