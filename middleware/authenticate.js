import passport from "../config/PassportConfig.js";

const authenticate = () => passport.authenticate("jwt", { session: false });

export default authenticate;
