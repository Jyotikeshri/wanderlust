const mongoose = require("mongoose");
const Listing = require("../model/listing");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
    owner: "65db1ccdd82c00abdf81ecac",
    categories: ["Beach", "Vineyards", "Top of the world"],
  }));
  await Listing.insertMany(initData.data);
  console.log("data added");
};

initDB();
