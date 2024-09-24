const AppError = require("../helpers/appError");

const authorization = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN" && req.user.role !== "ADMIN") {
      return next(new AppError("Forbidden", 403));
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
