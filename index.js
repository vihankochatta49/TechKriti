const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const { ensureAuthenticated } = require("./config/auth");
const userDb = require("./routes/registerModels");
const eventsDb = require("./routes/eventModel");
const imageDb = require("./routes/models");
const app = express();
const port = process.env.PORT || 3000;

//for authentication
require("./config/passport")(passport);
require("./config/googleAuth");
require("./config/facebookAuth");

//view engine
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//method override
app.use(methodOverride("_method"));

//database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/revise")
  .then(() => {
    console.log("connection successfull...");
  })
  .catch((err) => {
    console.log(err);
  });

//express session for login
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

//for authentication
app.use(passport.initialize());
app.use(passport.session());

//for error messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//for authentication with google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//for authentication with facebook
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

//getting routes
app.use("/", require("./routes/register.js"));
app.use("/", require("./routes/route.js"));

//route for home page
app.get("/", (req, res) => {
  res.render("home");
});

//route for main page
app.get("/feed", ensureAuthenticated, async (req, res) => {
  const profile = req.user;
  const events = await eventsDb.find().sort({ startDate: -1 });
  res.render("feed", { profile, events });
});

//route for updating profile
app.put("/update/:name/:id", async (req, res) => {
  try {
    const info = userDb.findOne({
      slugName: req.params.name,
    });
    await userDb.updateMany(info, {
      $set: {
        college: req.body.college,
        emailID: req.body.emailID,
        phone: req.body.phone,
      },
    });
    res.redirect(`/profile/${req.params.name}/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

//route for profile details
app.get("/profile/:name/:id", ensureAuthenticated, async (req, res) => {
  const profile = await userDb.findById(req.params.id);
  const history = await imageDb.find({ name: req.params.name });
  if (profile == null) res.send("Nahi hai");
  else res.render("dashboard", { profile, history });
});

//delete proof
app.delete("/delete/:id", async (req, res) => {
  const info = await imageDb.findById(req.params.id);
  const detail = await userDb.findOne({
    name: info.name,
  });
  await imageDb.findByIdAndDelete(req.params.id);
  res.redirect(`/profile/${detail.name}/${detail.id}`);
});

app.listen(port);
