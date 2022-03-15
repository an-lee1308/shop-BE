const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");
const Authentication = require("../middleware/Auth");

Router.post(
  "/order",
  Authentication.isUserValid,
  OrderController.paymentOffline
);
Router.post(
  "/payment/create",
  Authentication.isUserValid,
  OrderController.paymentOnline
);
Router.get("/order", Authentication.isUserValid, OrderController.getOrder);

module.exports = Router;
