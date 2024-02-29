const express = require("express");
const multer = require("multer");

const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/users");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { redirectUrl } = require("../middlewares/login.middleware");

const router = express.Router({ mergeParams: true });
router
  .route("/signUp")
  .get(userController.signupForm)
  .post(upload.single("pfp"), wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn
  );

router.get("/logout", userController.logOut);

module.exports = router;
