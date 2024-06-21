import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  // Get authorization header
  const bearerHeader = req.headers["authorization"];
  // check if token is undefined
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split()[1];
    req.token = bearerToken;
    return next();
  } else {
    //Forbidden
    res.json({
      error: {
        status: 403,
        message: "Forbidden",
      },
    });
  }
}
