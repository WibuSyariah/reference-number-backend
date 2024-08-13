const { User } = require("../models");
const AppError = require("../helpers/appError");
const { tokenToPayload } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = tokenToPayload(token);

      req.user = await User.findOne({
        logging: false,
        where: {
          id: decoded.id,
        },
        attributes: ["id", "username", "role"],
      });

      if (req.user == null) {
        return next(new AppError("User not found", 401));
      }

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new AppError("Token Expired", 401));
      }
      return next(new AppError("Token Invalid", 401));
    }
  }
  return next(new AppError(`Token Required`, 401));
};

module.exports = authentication;
