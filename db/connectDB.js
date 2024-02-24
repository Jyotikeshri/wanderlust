const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

module.exports.main = async () => {
  const connection = await mongoose.connect(MONGO_URL);
  if (connection) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }
};
