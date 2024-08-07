const { ReferenceNumber, sequelize } = require("../models");
const { toRoman } = require("@javascript-packages/roman-numerals")

class ReferenceNumberController {
  static async generate(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { applicantName, division, addressedTo, companyCode } = req.body;

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; 
      const romanNumeralMonth = toRoman(currentMonth);

      const lastReferenceNumber = await ReferenceNumber.findOne({
        where: {
          companyCode,
          month: currentMonth,
          year: currentYear,
        },
        order: [["id", "DESC"]],
      });

      let nextNumber = 1;
      if (lastReferenceNumber) {
        const lastNumberPart =
          lastReferenceNumber.referenceNumber.split("/")[0];
        nextNumber = parseInt(lastNumberPart) + 1;
      }

      const paddedNumber = nextNumber.toString().padStart(3, "0");
      const referenceNumber = `${paddedNumber}/${companyCode}/${romanNumeralMonth}/${currentYear}`;

      // Create a new reference number record
      const newReferenceNumber = await ReferenceNumber.create({
        applicantName,
        division,
        addressedTo,
        referenceNumber,
        companyCode,
        month: currentMonth,
        year: currentYear,
      });

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
}

module.exports = ReferenceNumberController;
