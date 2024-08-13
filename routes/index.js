const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const company = require("./company.route");
const division = require("./division.route");
const user = require("./user.route");
const referenceNumber = require("./referencenumber.route");

router.use("/user", user);
router.use("/reference-number", referenceNumber);

router.use(authentication, authorization);
router.use("/company", company);
router.use("/division", division);

module.exports = router;
