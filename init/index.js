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
    owner: "65d6228aabc2f87a54151033",
  }));
  await Listing.insertMany(initData.data);
  console.log("data added");
};

initDB();
