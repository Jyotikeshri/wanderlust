const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./User.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  image: {
    url: String,
    filename: String,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  categories: [
    {
      type: String,
      enum: [
        "Beach",
        "Vineyards",
        "Rooms",
        "Top of the world",
        "Amazing Pools",
        "Tree City",
        "Lake",
        "Caves",
        "New",
        "Skiing",
        "Farms",
        "Iconic Cities",
        "Camping",
        "Trending",
        "Arctic",
        "Bed and Breakfast",
        "Castles",
      ],
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
