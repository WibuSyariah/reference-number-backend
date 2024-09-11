const express = require("express");
const router = express.Router();
const ReferenceNumberController = require("../controllers/referencenumber.controller");
const authorization = require("../middlewares/authorization");

router.post("", ReferenceNumberController.generate);
router.post("/document", ReferenceNumberController.generateDocument);
router.get("", ReferenceNumberController.readAll);
router.get("/years", ReferenceNumberController.readYears);

router.use(authorization);
router.get("/archive", ReferenceNumberController.readArchive);

module.exports = router;
