"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ReferenceNumber, { foreignKey: "divisionId" });
    }
  }
  Division.init(
    {
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      code: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Division",
    },
  );
  return Division;
};
