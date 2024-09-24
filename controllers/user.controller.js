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
        message: "Pengguna dibuat",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Nama pengguna sudah digunakan`, 400));
      }

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
        message: "Daftar pengguna",
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

      let user = await User.findOne({
        where: { id },
        attributes: ["id", "username", "role"],
      });

      if (user.role === "SUPERADMIN" && req.user.role !== "SUPERADMIN") {
        throw new AppError("Forbidden", 403);
      }

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
          throw new AppError("Kata sandi tidak cocok", 400);
        } else {
          hashedPassword = hashPassword(newPassword);

          updateData.password = hashedPassword;
        }
      }

      await user.update(updateData);

      res.status(200).json({
        message: "Pengguna diperbarui",
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
        throw new AppError("Kata sandi tidak cocok", 400);
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
        message: "Kata sandi diganti",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (user.role === "SUPERADMIN") {
        throw new AppError("Forbidden", 403);
      }

      if (!user) {
        throw new AppError("Pengguna tidak ditemukan", 404);
      }

      user.destroy();

      res.status(200).json({
        message: "Pengguna dihapus",
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
        throw new AppError("Nama pengguna atau kata sandi salah", 401);
      }

      if (!(await comparePassword(password, user.password))) {
        throw new AppError("Nama pengguna atau kata sandi salah", 401);
      }

      user = omit(user.get(), ["password"]);

      const accessToken = payloadToToken(user);

      res.status(200).json({
        message: "Berhasil masuk",
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
