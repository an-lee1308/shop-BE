const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");
const Authentication = require("../middleware/Auth");

Router.post(
  "/order",
  Authentication.isUserValid,
  OrderController.paymentOffline
);

module.exports = Router;
