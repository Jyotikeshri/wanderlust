const mongoose = require("mongoose");
const Listing = require("../model/listing");
const initData = require("./data");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL =
  "mongodb+srv://jyotikeshri9b21:T9ghKxt6iNg4aHST@cluster0.uuls0cv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  // Connect to MongoDB database
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to the Database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err}`);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65e460e63c6c0cd5e656d0df",
    categories: ["Beach", "Vineyards", "Top of the world"],
  }));
  await Listing.insertMany(initData.data);
  console.log("data added");
};

initDB();
