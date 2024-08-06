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
      // define association here
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
      division: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      addressedTo: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      companyCode: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      month: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      year: {
        allowNull: false,
        type: DataTypes.INTEGER
      }    
    },
    {
      sequelize,
      modelName: "ReferenceNumber",
    },
  );
  return ReferenceNumber;
};
