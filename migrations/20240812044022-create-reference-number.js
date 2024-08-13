"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReferenceNumbers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      referenceNumber: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      applicantName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      letterSubject: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      addressedTo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      month: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Users" },
          key: "id",
        },
      },
      companyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Companies" },
          key: "id",
        },
      },
      divisionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: "Divisions" },
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ReferenceNumbers");
  },
};
