const express = require("express");
const Router = express.Router();
const ProductController = require("../controllers/ProductController");
const Authentication = require("../middleware/Auth");
Router.get(
  "/admin/products",
  Authentication.isAdmin,
  ProductController.getAllProduct
); //get product by search or get all product
Router.get("/products", ProductController.getProduct); //get product by search or get all product
Router.get("/products/:category", ProductController.getProductByCategory); // get product by category
Router.get("/detailproducts/:id", ProductController.getProductById); // get product by ID
Router.post(
  "/detailproducts/:id/comment",
  Authentication.isUserValid,
  ProductController.postComment
);
Router.get("/detailproducts/:id/comment", ProductController.getComment);
module.exports = Router;
