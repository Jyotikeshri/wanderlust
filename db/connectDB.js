const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_ATLAS_URL;

module.exports.main = async () => {
  const connection = await mongoose.connect(MONGO_URL);
  if (connection) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }
};
