const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;
const PROPERTIES_FILE = "properties.json";

app.use(bodyParser.json());
app.use(cors());

// Load properties from JSON file
let properties = [];

try {
  const data = fs.readJsonSync(PROPERTIES_FILE);
  if (Array.isArray(data.properties)) {
    properties = data.properties;
  } else {
    throw new Error("Invalid properties data format");
  }
} catch (error) {
  console.error("Error reading properties file:", error);
}

// Endpoint to get all properties
app.get("/properties", (req, res) => {
  res.json({ properties });
});

// Endpoint to add a new property
app.post("/properties", (req, res) => {
  const newProperty = req.body;
  console.log("New property data received:", newProperty);

  // Generate unique _id using uuid
  newProperty._id = uuidv4();

  // Ensure the group is set to the same initial value as in the frontend
  newProperty.group = newProperty.group || "Full Property List";

  properties.push(newProperty);
  savePropertiesToFile();
  res.status(201).json(newProperty);
});

// Endpoint to update a property
app.put("/properties/:id", (req, res) => {
  const { id } = req.params;
  const updatedProperty = req.body;

  const index = properties.findIndex((property) => property._id === id);
  if (index !== -1) {
    properties[index] = { ...properties[index], ...updatedProperty };
    savePropertiesToFile();
    res.status(200).json(properties[index]);
  } else {
    res.status(404).json({ message: "Property not found" });
  }
});

// Helper function to save properties to file
function savePropertiesToFile() {
  try {
    fs.writeJsonSync(PROPERTIES_FILE, { properties }, { spaces: 2 });
  } catch (error) {
    console.error("Error writing properties file:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
