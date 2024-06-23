import passportStrategy from "passport-jwt";
import passport from "passport";
import User from "../models/user.js";

const jwtStrategy = passportStrategy.Strategy;
const ExtractJwt = passportStrategy.ExtractJwt;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new jwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
export default passport;
