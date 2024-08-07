const express = require("express");
const router = express.Router();

const referenceNumber = require("./referencenumber.route")
const user = require("./user.route")

router.use("/reference-number", referenceNumber)
router.use("/user", user)

module.exports = router