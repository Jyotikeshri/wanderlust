const Listing = require("../../model/listing");

module.exports.getListings = async (req, res, next) => {
  const allListings = await Listing.find({});
  console.log(req.user);
  res.render("listings/index", { allListings });
};

module.exports.newListing = (req, res, next) => {
  res.render("listings/new.ejs");
};
module.exports.getListingById = async (req, res, next) => {
  const list_id = req.params.id;
  const result = await Listing.findById(list_id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(result);
  const list_details = result;
  if (!list_details) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/list.ejs", { list_details });
};

module.exports.createNew = async (req, res, next) => {
  const listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
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

module.exports.deleteListing = async (req, res, next) => {
  const id = req.params.id;
  Listing.findByIdAndDelete(id).then((result) => {
    console.log(result);
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
  });
};
