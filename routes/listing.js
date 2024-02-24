const express = require("express");
const wrapAsync = require("../util/wrapAsync.js");
const app = express();

const router = express.Router();

const { isLoggedIn, isOwner } = require("../middlewares/login.middleware.js");
const {
  getListings,
  newListing,
  getListingById,
  createNew,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings/listing.js");
const { validateListing } = require("../middlewares/validation.js");

app.set("view engine", "ejs");

router.get("/", wrapAsync(getListings));

router.get("/new", isLoggedIn, newListing);

router.get("/:id", wrapAsync(getListingById));

router.post("/", isLoggedIn, validateListing, wrapAsync(createNew));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(updateListing)
);

router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(deleteListing)
);

module.exports = router;
