const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../routes/registerModels");

passport.use(
  new FacebookStrategy(
    {
      clientID: "410601497786598",
      clientSecret: "825ede16c0a9665bf0ee4aa235d2de94",
      callbackURL: "http://localhost:3000/facebook/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          name: profile.displayName,
          email: profile.email,
          provider: "Facebook",
        },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
