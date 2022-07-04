const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

const app = express();
const port = 3000;

require("./config/passport")(passport);
require("./config/googleAuth");
require("./config/facebookAuth");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/revise")
  .then(() => {
    console.log("connection successfull...");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 1000000000000000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/feed",
    failureRedirect: "/auth/google/failure",
  })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/feed",
    failureRedirect: "/auth/facebook/failure",
  })
);

//handle google auth failure
app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

//handle facebook auth failure
app.get("/auth/facebook/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.use("/", require("./routes/register.js"));
app.use("/", require("./routes/route.js"));

app.get("/", (req, res) => {
  res.render("register");
});

app.get("/feed", ensureAuthenticated, (req, res) => {
  res.send("Success");
});

app.listen(port);
