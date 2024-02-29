const Listing = require("../../model/listing");

module.exports.getListings = async (req, res, next) => {
  const allListings = await Listing.find({});

  console.log(req.user);
  res.render("listings/index", { allListings });
};

module.exports.filterListings = async (req, res, next) => {
  const category = req.params.category;
  console.log("category", category);
  let allListings;
  try {
    if (category) {
      allListings = await Listing.find({ categories: { $in: [category] } });
      console.log(allListings);

      // res.render("listings/index", { allListings });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  if (typeof req.file === "undefined") {
    req.flash("error", "Add The listing image ");
    return res.redirect("/listings");
  }

  const url = req.file.path;
  const filename = req.file.filename;

  const listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  console.log(req.body.categories);

  //Check if req.body.category exists before splitting
  if (req.body.categories && req.body.categories.trim() !== "") {
    const categoriesArray = req.body.categories
      .split(",")
      .map((category) => category.trim());
    newListing.categories = categoriesArray;
    console.log("this is category", categoriesArray);
  }

  newListing.save().then((result) => {
    console.log("Data saved");
    console.log(result);
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
  let originalImage = list.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { id, list, originalImage });
};

module.exports.updateListing = async (req, res, next) => {
  const id = req.params.id;

  console.log(req.body.listing);
  // console.log(req.file);

  const listing = await Listing.findByIdAndUpdate(
    id,
    {
      ...req.body.listing,
    },
    { new: true }
  );
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
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
