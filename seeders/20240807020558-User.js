"use strict";

require("dotenv").config();
const env = process.env;
const { fn } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "superadmin",
        password: hashPassword(env.SUPERADMIN_PASSWORD),
        role: "SUPERADMIN",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
