const express = require("express");
const wrapAsync = require("../util/wrapAsync.js");
const app = express();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

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
  filterListings,
} = require("../controllers/listings/listing.js");
const listingController = require("../controllers/listings/listing.js");
const { validateListing } = require("../middlewares/validation.js");

app.set("view engine", "ejs");

router.route("/").get(wrapAsync(getListings)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  wrapAsync(createNew)
);
router.get("/filter/:category", wrapAsync(listingController.filterListings));
router.post("/search", wrapAsync(listingController.searchResult));

router.get("/new", isLoggedIn, newListing);
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

router.route("/:id").get(wrapAsync(getListingById)).patch(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),

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
