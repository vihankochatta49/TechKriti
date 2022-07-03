const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../routes/registerModels");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "195118986970-o3vldjfl0omasjphi6ue1ibpk5tfo29a.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          name: profile.displayName,
          email: profile.email,
          provider: "GOOGLE",
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
