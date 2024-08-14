const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");
const authorization = require("../middlewares/authorization");


router.get("/", CompanyController.readAll);

router.use(authorization)
router.post("/", CompanyController.create);
router.delete("/:id", CompanyController.delete);

module.exports = router;
