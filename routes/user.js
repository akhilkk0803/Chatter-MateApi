const express = require("express");
const routes = express.Router();
const isauth = require("../middleware/is-auth");
const userController = require("../controllers/user");
routes.post("/login", userController.login);
routes.post("/signup", userController.signup);
routes.get("/", isauth, userController.getuser);

module.exports = routes;
