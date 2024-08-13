"use strict";

const { fn } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Companies", [
      {
        name: "MODA GLOBAL MARITIM",
        code: "MGM",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "MAZO ARMADA PASIFIK",
        code: "MAP",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "AURORA TRANS PASIFIK",
        code: "ATP",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "GEO TEKNO GLOBALINDO",
        code: "GTG",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
      {
        name: "UNO GLOBAL SATELIT",
        code: "UGS",
        createdAt: fn("NOW"),
        updatedAt: fn("NOW"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Companies", null, {});
  },
};
