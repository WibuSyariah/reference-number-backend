const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const UserController = require("../controllers/user.controller");

router.post("/login", UserController.login);

router.use(authentication);
router.put("/", UserController.update);

router.use(authorization);
router.post("", UserController.create);
router.get("", UserController.readAll);

module.exports = router;
