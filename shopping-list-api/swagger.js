const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Shopping List API",
    description: "CSE341 Project 2 - Shopping List API"
  },
  host: "localhost:3000",
  schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"]; // swagger-autogen will scan your routes used in server.js

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ swagger.json generated");
});
