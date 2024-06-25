import passportStrategy from "passport-jwt";
import passport from "passport";
import User from "../models/user.js";

const jwtStrategy = passportStrategy.Strategy;
const ExtractJwt = passportStrategy.ExtractJwt;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new jwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload._id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
export default passport;
