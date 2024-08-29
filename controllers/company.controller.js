const { Company } = require("../models");
const AppError = require("../helpers/appError");

class CompanyController {
  static async create(req, res, next) {
    try {
      await Company.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Perusahaan dibuat",
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next(new AppError(`Nama atau kode sudah digunakan`, 400));
      }

      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { limit, currentPage } = req.query;

      let options = {
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
      };

      const companies = await Company.findAndCountAll(options);

      res.status(200).json({
        message: "Daftar perusaahaan",
        data: {
          companies: companies.rows,
          totalPages: Math.ceil(companies.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id);

      if (!company) {
        throw new AppError("Perusahaan tidak ditemukan", 404);
      }

      company.destroy();

      res.status(200).json({
        message: "Perusahaan dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;
