const express = require("express");
const router = express.Router();
const ReferenceNumberController = require("../controllers/referencenumber.controller");

router.post("", ReferenceNumberController.generate);
router.get("", ReferenceNumberController.readAll);

module.exports = router;
