'use strict';

require("dotenv").config();
const env = process.env;
const { fn } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert("Users", [{
      username: "superadmin",
      password: hashPassword(env.SUPERADMIN_PASSWORD),
      role: "SUPERADMIN",
      createdAt: fn("NOW"),
      updatedAt: fn("NOW")
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  }
};
