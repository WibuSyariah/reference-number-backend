const express = require("express");
const router = express.Router();
const ReferenceNumberController = require("../controllers/referencenumber.controller");

router.post("", ReferenceNumberController.generate);
router.get("", ReferenceNumberController.readAll);
router.get("/archive", ReferenceNumberController.readArchive)

module.exports = router;
