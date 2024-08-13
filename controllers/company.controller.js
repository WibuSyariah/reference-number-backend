const { Company } = require("../models");
const AppError = require("../helpers/appError");

class CompanyController {
  static async create(req, res, next) {
    try {
      await Company.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Company created",
      });
    } catch (error) {
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { limit, page } = req.query;

      let options = {
        limit: limit ? Number(limit) : 20,
        offset: (Number(page ? page : 1) - 1) * (limit ? Number(limit) : 20),
      };

      const companies = await Company.findAndCountAll(options);

      res.status(200).json({
        message: "Company list",
        data: {
          companies: companies.rows,
          totalPages: Math.ceil(companies.count / Number(limit)),
          currentPage: Number(page),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id)

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      company.destroy()

      res.status(200).json({
        message: "Company deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;