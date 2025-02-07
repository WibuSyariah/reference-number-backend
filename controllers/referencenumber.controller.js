const { ReferenceNumber, Company, Division, sequelize } = require("../models");
const { toRoman } = require("@javascript-packages/roman-numerals");
const { Op } = require("sequelize");
const AppError = require("../helpers/appError");
const docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("node:fs");
const path = require("node:path")

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
        throw new AppError("Perusahaan tidak ditemukan", 404);
      }

      const division = await Division.findByPk(divisionId);

      if (!division) {
        throw new AppError("Divisi tidak ditemukan", 404);
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

      let nextNumber = 1;
      if (lastReferenceNumber) {
        const lastNumberPart =
          lastReferenceNumber.referenceNumber.split("/")[0];
        nextNumber = parseInt(lastNumberPart) + 1;
      }

      const paddedNumber = nextNumber.toString().padStart(3, "0");
      const referenceNumber = `${paddedNumber}/${division.code}/${company.code}-JKT/${romanNumeralMonth}/${currentYear}`;

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
        message: "Nomor surat dibuat",
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
      const { limit, currentPage, startDate, endDate, companyId, divisionId } =
        req.query;
      const currentYear = new Date().getFullYear();

      let options = {
        where: {
          year: currentYear,
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
          ...(companyId
            ? {
                companyId,
              }
            : {}),
          ...(divisionId
            ? {
                divisionId,
              }
            : {}),
        },
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Division,
            attributes: ["name"],
          },
        ],
      };

      const referenceNumber = await ReferenceNumber.findAndCountAll(options);

      res.status(200).json({
        message: "Daftar nomor surat",
        data: {
          referenceNumbers: referenceNumber.rows,
          totalPages: Math.ceil(referenceNumber.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async readYears(req, res, next) {
    try {
      const years = await ReferenceNumber.findAll({
        attributes: ["year"],
        group: ["year"],
        order: [["year", "DESC"]],
        offset: 1,
      });

      res.status(200).json({
        message: "Tahun-tahun nomor surat",
        data: {
          years,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async readArchive(req, res, next) {
    try {
      const { limit, currentPage, companyId, divisionId, year } = req.query;

      const currentYear = new Date().getFullYear();

      let options = {
        where: {
          ...(year
            ? {
                year: year,
              }
            : { year: currentYear - 1 }),

          ...(companyId
            ? {
                companyId,
              }
            : {}),
          ...(divisionId
            ? {
                divisionId,
              }
            : {}),
        },
        limit: limit ? Number(limit) : 20,
        offset:
          (Number(currentPage ? currentPage : 1) - 1) *
          (limit ? Number(limit) : 20),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Division,
            attributes: ["name"],
          },
        ],
      };

      const referenceNumber = await ReferenceNumber.findAndCountAll(options);

      res.status(200).json({
        message: "Arsip nomor surat",
        data: {
          referenceNumbers: referenceNumber.rows,
          totalPages: Math.ceil(referenceNumber.count / Number(limit)),
          currentPage: Number(currentPage),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateDocument(req, res, next) {
    try {
      const { last_name, first_name, phone, description } = req.body;

      const content = fs.readFileSync(
        path.join(__dirname, "../templates/input.docx"),
        "binary",
      );

      const zip = new PizZip(content);

      const doc = new docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render({
        first_name,
        last_name,
        phone,
        description,
      });

      const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      });

      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="generated_document.docx"',
      });

      res.send(buf);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReferenceNumberController;
