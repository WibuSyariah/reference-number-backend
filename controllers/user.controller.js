const { User } = require("../models");
const { payloadToToken } = require("../helpers/jwt");
const AppError = require("../helpers/appError");
const { omit } = require("lodash");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { Op } = require("sequelize");

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

  static async readAll(req, res, next) {
    try {
      const { search, limit, currentPage } = req.query;

      let condition = {
        where: {
          ...(search
            ? {
                [Op.or]: [
                  {
                    username: {
                      [Op.like]: `${search}%`,
                    },
                  },
                  {
                    fullName: {
                      [Op.like]: `${search}%`,
                    },
                  },
                ],
              }
            : {}),
        },
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        attributes: {
          exclude: ["password"],
        },
        order: [["id", "ASC"]],
      };

      const users = await User.findAndCountAll(condition);

      res.status(200).json({
        message: "User list",
        data: {
          users: users.rows,
          totalPages: Math.ceil(users.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { fullName, newPassword, confirmPassword } = req.body;
      let hashedPassword = "";
      let updateData = {
        ...(fullName
          ? {
              fullName,
            }
          : {}),
      };

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new AppError("Passwords do not match", 400);
        } else {
          hashedPassword = hashPassword(newPassword);

          updateData.password = hashedPassword;
        }
      }

      await User.update(updateData, {
        where: {
          id,
        },
      });

      res.status(200).json({
        message: "User updated",
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

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.destroy();

      res.status(200).json({
        message: "User deleted",
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
}

module.exports = UserController;
