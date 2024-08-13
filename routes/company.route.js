const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");

router.post("/", CompanyController.create);
router.get("/", CompanyController.readAll);
router.delete("/:id", CompanyController.delete);

module.exports = router;
