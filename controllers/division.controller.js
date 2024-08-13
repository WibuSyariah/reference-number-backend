const { Division } = require("../models");
const AppError = require("../helpers/appError");

class DivisionController {
  static async create(req, res, next) {
    try {
      await Division.create({
        ...req.body,
      });

      res.status(201).json({
        message: "Division created",
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

      const divisions = await Division.findAndCountAll(options);

      res.status(200).json({
        message: "Division list",
        data: {
          divisions: divisions.rows,
          totalPages: Math.ceil(divisions.count / Number(limit)),
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

      const division = await Division.findByPk(id);

      if (!division) {
        throw new AppError("Division not found", 404);
      }

      division.destroy();

      res.status(200).json({
        message: "Division deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DivisionController;
