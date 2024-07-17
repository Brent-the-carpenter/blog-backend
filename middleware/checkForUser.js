import jwt from "jsonwebtoken";
import createError from "http-errors";

const checkForUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const userToken = authHeader.split(" ")[1];

      if (userToken) {
        const payload = jwt.verify(userToken, process.env.SECRET_KEY);

        if (payload) {
          req.user = { _id: payload._id };
        }
      }
    }

    return next();
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export default checkForUser;
