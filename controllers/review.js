const Listing = require("../model/listing");
const Review = require("../model/review");
const ExpressError = require("../util/expressError");

module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    await listing.save();
    await review.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add review");
    res.redirect(`/listings/${req.params.id}`);
  }
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
