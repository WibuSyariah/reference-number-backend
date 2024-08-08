const { User } = require("../models");
const { payloadToToken } = require("../helpers/jwt");
const AppError = require("../helpers/appError");
const { omit } = require("lodash");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");

class UserController {
  static async create(req, res, next) {
    try {
      await User.create({
        ...req.body,
      });

      res.status(201).json({
        message: "User created",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      let user = await User.findOne({
        where: { username },
        attributes: ["id", "username", "role", "password"],
      });

      if (!user || !password) {
        throw new AppError("Wrong username or password", 401);
      }

      if (!(await comparePassword(password, user.password))) {
        throw new AppError("Wrong username or password", 401);
      }

      user = omit(user.get(), ["password"]);

      const accessToken = payloadToToken(user);

      res.status(200).json({
        message: "Login success",
        data: {
          accessToken,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { id } = req.user;
      const { newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
      }

      const hashedPassword = hashPassword(newPassword);

      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id,
          },
        },
      );

      res.status(200).json({
        message: "Password changed",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
