const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/UserController");

Router.post("/register", UserController.registerUser);
Router.post("/login", UserController.loginUser);

module.exports = Router;
