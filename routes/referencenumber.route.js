const express = require("express");
const router = express.Router()
const ReferenceNumberController = require("../controllers/referencenumber.controller");

router.post("/generate", ReferenceNumberController.generate)

module.exports = router