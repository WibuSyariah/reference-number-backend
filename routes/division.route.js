const express = require("express");
const router = express.Router();
const DivisionController = require("../controllers/division.controller");


router.post("/", DivisionController.create);
router.get("/", DivisionController.readAll);
router.delete("/:id", DivisionController.delete);

module.exports = router;
