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
Router.delete(
  "/order",
  Authentication.isUserValid,
  OrderController.deleteOrder
);
Router.post(
  "/order/cancel",
  Authentication.isUserValid,
  OrderController.cancelOrder
);
Router.get("/orders", Authentication.isAdmin, OrderController.getAllOrder);
Router.post(
  "/order/accept",
  Authentication.isAdmin,
  OrderController.acceptOrder
);

module.exports = Router;
