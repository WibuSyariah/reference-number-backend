"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReferenceNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Company, { foreignKey: "companyId" });
      this.belongsTo(models.Division, { foreignKey: "divisionId" });
    }
  }
  ReferenceNumber.init(
    {
      referenceNumber: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      applicantName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      letterSubject: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      addressedTo: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      month: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      year: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      companyId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      divisionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "ReferenceNumber",
    },
  );
  return ReferenceNumber;
};
