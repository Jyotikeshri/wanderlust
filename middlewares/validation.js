const { listingSchema, reviewSchema } = require("../listing.js");
const ExpressError = require("../util/expressError.js");

module.exports.validateListing = async (req, res, next) => {
  if (req.method === "POST" || req.method === "PATCH") {
    console.log("patch request");
    const { error } = listingSchema.validate(req.body.listing).error;
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
  }
  next(); // Call next middleware/route handler
};

module.exports.validateReview = async (req, res, next) => {
  console.log(req.body.review);
  const { error } = await reviewSchema.validate(req.body.review).error; // Corrected: req.body.review
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
