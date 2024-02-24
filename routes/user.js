const express = require("express");

const wrapAsync = require("../util/wrapAsync");
const User = require("../model/User");
const passport = require("passport");
const { redirectUrl } = require("../middlewares/login.middleware");

const router = express.Router({ mergeParams: true });

router.get("/signUp", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signUp",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;

      const registeredUser = await User.register({ email, username }, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        } else {
          req.flash(
            "success",
            "Account has been created and you are now logged in"
          );
          res.redirect("/listings");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signUp");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    }
  });
});

module.exports = router;
