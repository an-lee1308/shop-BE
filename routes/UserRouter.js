const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/UserController");

Router.post("/register", UserController.registerUser);
Router.post("/login", UserController.loginUser);
Router.get("/accountVerification/:code", UserController.verifyCode);
Router.post("/forgot", UserController.forgetPassword);
Router.get("/forgot/:token", UserController.checkTokenValid);
Router.post("/forgot/:id", UserController.forgotChangePassword);

Router.get("/user", Auth.isUserValid, UserController.getUser);

module.exports = Router;
