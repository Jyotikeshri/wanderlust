const User = require("../model/User.js");
const ExpressError = require("../util/expressError.js");

module.exports.errorHandle = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) statusCode = 500;
  if (!message) message = "page not found!!"; // Default to 500 if statusCode is not provided
  res.status(statusCode).render("error.ejs", { err });
};

module.exports.allErrorHandle = (req, res, next) => {
  next(new ExpressError("404", "Page not found"));
};

module.exports.flashhandle = async (req, res, next) => {
  res.locals.success = req.flash("success");

  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log("this is user", req.user);
  if (req.user) {
    res.locals.LoggedInUser = await User.findById(req.user._id);
  } else {
    // Handle the case when the user is not authenticated
    res.locals.LoggedInUser = null; // or any default value you want to use
  }

  next();
};
