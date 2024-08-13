const { ReferenceNumber, Company, Division, sequelize } = require("../models");
const { toRoman } = require("@javascript-packages/roman-numerals");
const { Op } = require("sequelize");
const AppError = require("../helpers/appError");


class ReferenceNumberController {
  static async generate(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        applicantName,
        letterSubject,
        addressedTo,
        companyId,
        divisionId,
      } = req.body;

      const company = await Company.findByPk(companyId);

      if (!company) {
        throw new AppError("Company not found", 404);
      }

      const division = await Division.findByPk(divisionId);

      if (!division) {
        throw new AppError("Division not found", 404);
      }

      const userId = req.user.id;

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const romanNumeralMonth = toRoman(currentMonth);


      const lastReferenceNumber = await ReferenceNumber.findOne({
        where: {
          companyId,
          month: currentMonth,
          year: currentYear,
        },
        order: [["id", "DESC"]],
        transaction,
      });

      console.log("masuk 1");
      

      let nextNumber = 1;
      if (lastReferenceNumber) {
        const lastNumberPart =
          lastReferenceNumber.referenceNumber.split("/")[0];
        nextNumber = parseInt(lastNumberPart) + 1;
      }

      const paddedNumber = nextNumber.toString().padStart(3, "0");
      const referenceNumber = `${paddedNumber}/${division.code}.${company.code}/${romanNumeralMonth}/${currentYear}`;

      // Create a new reference number record
      const newReferenceNumber = await ReferenceNumber.create(
        {
          applicantName,
          letterSubject,
          addressedTo,
          referenceNumber,
          userId,
          companyId,
          divisionId,
          month: currentMonth,
          year: currentYear,
        },
        { transaction },
      );

      await transaction.commit();
      res.status(201).json({
        message: "Reference Number generated",
        data: {
          referenceNumber,
        },
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const { startDate, endDate, limit, page } = req.query;

      let options = {
        where: {
          ...(startDate && endDate
            ? {
                createdAt: {
                  [Op.between]: [
                    `${startDate} 00:00:00`,
                    `${endDate} 23:59:59`,
                  ],
                },
              }
            : {}),
        },
        limit: limit ? Number(limit) : 20,
        offset: (Number(page ? page : 1) - 1) * (limit ? Number(limit) : 20),
        order: [["createdAt", "DESC"]],
      };

      const referenceNumber = await ReferenceNumber.findAndCountAll(options);

      res.status(200).json({
        message: "Reference Number list",
        data: {
          referenceNumbers: referenceNumber.rows,
          totalPages: Math.ceil(referenceNumber.count / Number(limit)),
          currentPage: Number(page),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReferenceNumberController;
