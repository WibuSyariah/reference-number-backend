"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Divisions", [
      {
        name: "OPERATIONAL",
        code: "OP",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "HUMAN CAPITAL",
        code: "HC",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "INFORMATION TECHNOLOGY",
        code: "IT",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "FINANCE ACCOUNTING",
        code: "FA",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "PROCUREMENT",
        code: "PRO",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "COMMERCIAL",
        code: "COM",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "LEGAL",
        code: "LGL",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Divisions", null, {});
  },
};
