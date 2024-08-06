const express = require("express");
const router = express.Router();

const referenceNumber = require("./referencenumber.route")

router.use("/reference-number", referenceNumber)

module.exports = router