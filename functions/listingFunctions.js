const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isLoggedIn } = require("../middlewares/login.middleware.js");
const { validateListing } = require("../util/validation.js");

module.exports.getAllListings = wrapAsync(async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

module.exports.getListingById = async (req, res, next) => {
  const list_id = req.params.id;
  const result = await Listing.findById(list_id).populate("reviews");
  const list_details = result;
  if (!list_details) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/list.ejs", { list_details });
};

module.exports.postListing = async (req, res, next) => {
  const listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.save().then((result) => {
    console.log("Data saved");
    req.flash("success", "Listing saved successfully");
    res.redirect("/listings");
  });
};

module.exports.editListing = async (req, res, next) => {
  const id = req.params.id;
  const foundListing = await Listing.findById(id);
  const list = foundListing;
  if (!list) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { id, list });
};

module.exports.updateListing = async (req, res, next) => {
  const id = req.params.id;

  console.log(req.body.listing);
  const listing = req.body.listing;
  await Listing.findByIdAndUpdate(
    id,
    {
      ...req.body.listing,
    },
    { new: true }
  );
  req.flash("success", "Listing Updated successfully");
  res.redirect(`/listings/${id}`);
};

const deleteListing = (req, res, next) => {
  isLoggedIn(req, res, () => {
    validateListing(req, res, async () => {
      try {
        const id = req.params.id;
        const result = await Listing.findByIdAndDelete(id);
        console.log(result);
        req.flash("success", "Listing Deleted successfully");
        res.redirect("/listings");
      } catch (err) {
        req.flash("error", "Error deleting listing");
        res.redirect("/listings");
      }
    });
  });
};

module.exports = { deleteListing };
