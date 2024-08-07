"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "USER",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(instance, options) {
          instance.password = hashPassword(instance.password);
        },
        beforeUpdate(instance, options) {
          if (instance.password) {
            instance.password = hashPassword(instance.password);
          }
        },
      },
    },
  );
  return User;
};
