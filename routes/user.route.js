const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const UserController = require("../controllers/user.controller")

router.post("/login", UserController.login)

router.use(authentication, authorization)
router.post("/register", UserController.create)

module.exports = router;
