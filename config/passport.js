const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Customers = mongoose.model("customers");
const keys = require("../config/keys");
var passport = require("passport");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const passport1 = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Customers.findById(jwt_payload.id)
        .then((customers) => {
          if (customers) {
            return done(null, customers);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};

module.exports = passport1;
