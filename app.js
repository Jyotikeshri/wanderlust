if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const { main } = require("./db/connectDB.js");

const ejsMate = require("ejs-mate");

const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const User = require("./model/User.js");
const {
  errorHandle,
  flashhandle,

  allErrorHandle,
} = require("./middlewares/error.middleware.js");

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(flash());

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

app.use(flashhandle);

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

main(); //mongoDB connect function

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.all("*", allErrorHandle);

app.use(errorHandle);
