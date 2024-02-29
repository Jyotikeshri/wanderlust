const express = require("express");
const wrapAsync = require("../util/wrapAsync.js");
const app = express();
const {
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares/login.middleware.js");

const { validateReview } = require("../middlewares/validation.js");

const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/review.js");

app.set("view engine", "ejs");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
