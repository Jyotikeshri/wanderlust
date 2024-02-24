const express = require("express");
const wrapAsync = require("../util/wrapAsync.js");
const app = express();

const validateReview = require("../middlewares/validation.js");

const router = express.Router({ mergeParams: true });

const {
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares/login.middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");

app.set("view engine", "ejs");

router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
