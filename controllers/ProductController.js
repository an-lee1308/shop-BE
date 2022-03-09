const ProductModel = require("../model/ProductModel");
const CommentModel = require("../model/commentModel");
const User = require("../model/UserModel");

module.exports = {
  // Get all products
  getAllProduct: async (req, res) => {
    return res.json(await ProductModel.find({}));
  },
};
