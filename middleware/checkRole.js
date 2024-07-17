const checkPermissions = function (req, res, next) {
  if (req.user.role !== "admin" || req.user.role !== "member") {
    return res.status(403).json({
      error: "Forbidden",
      message: "You do not have permission to access this resource",
    });
  }
  return next();
};
export default checkPermissions;
