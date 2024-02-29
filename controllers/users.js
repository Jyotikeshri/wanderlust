const User = require("../model/User");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const registeredUser = await User.register({ email, username }, password);
    if (typeof req.file !== "undefined") {
      const url = req.file.path;
      const filename = req.file.filename;
      registeredUser.image = { url, filename };
      await registeredUser.save();
    }
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
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logIn = (req, res) => {
  req.flash("success", "Welcome back!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  // console.log("this is user", req.user);
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    }
  });
};
