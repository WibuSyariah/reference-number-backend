const express = require("express");
const router = express.Router();
const DivisionController = require("../controllers/division.controller");
const authorization = require("../middlewares/authorization");


router.get("/", DivisionController.readAll);

router.use(authorization)
router.post("/", DivisionController.create);
router.delete("/:id", DivisionController.delete);

module.exports = router;
