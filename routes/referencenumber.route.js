const express = require("express");
const router = express.Router()
const authentication = require("../middlewares/authentication");
const ReferenceNumberController = require("../controllers/referencenumber.controller");

router.use(authentication)
router.post("/generate", ReferenceNumberController.generate)
router.get("", ReferenceNumberController.readAll)

module.exports = router