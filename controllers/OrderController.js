const OrderModel = require("../model/OrderModel");
const ProductModel = require("../model/ProductModel");

module.exports = {
  // handle payment offline
  paymentOffline: async (req, res) => {
    const { address, products, payment } = req.body;
    const { _id } = req.user.data;
    const totalPrice = products.reduce((a, b) => {
      return a + b.newprice * b.soluong;
    }, 0);
    try {
      const order = new OrderModel({
        products,
        address,
        payment,
        timeorder: Date.now(),
        status_order: false,
        id_user: _id,
        totalPrice,
      });
      await order.save();
      return res.json({
        msg: "Đặt hàng thành công ",
        statusCode: 200,
      });
    } catch (err) {
      return res.json({
        msg: "Có lỗi đặt hàng",
        statusCode: 404,
      });
    }
  },
  paymentOnline: async function (req, res) {
    res
      .status(200)
      .json({ code: "00", Message: "Tính năng đang được nghiên cứu" });
  },
  getOrder: async (req, res) => {
    const { _id } = req.user.data;
    const order = await OrderModel.find({ id_user: _id });
    return res.json(order);
  },
  deleteOrder: async (req, res) => {
    const { _id } = req.body; // id Order
    const idUser = req.user.data._id; // id User
    try {
      const Order = await OrderModel.findOneAndDelete({
        id_user: idUser,
        _id,
      });
      return res.json({
        statusCode: 200,
        msg: "Đã xóa đơn hàng",
      });
    } catch (err) {
      return res.json({
        statusCode: 404,
        msg: err,
      });
    }
  },
  cancelOrder: async (req, res) => {
    const { _id } = req.body; // id Order
    const idUser = req.user.data._id; // id User
    try {
      const Order = await OrderModel.findOne({
        id_user: idUser,
        _id,
      });
      Order.cancelreason = "0";
      await Order.save();
      return res.json({
        statusCode: 200,
        msg: "Đã hủy đơn hàng",
      });
    } catch (err) {
      return res.json({
        statusCode: 404,
        msg: err,
      });
    }
  },
  getAllOrder: async (req, res) => {
    return res.json(await OrderModel.find({}));
  },
  acceptOrder: async (req, res) => {
    const { _id } = req.body;
    try {
      const order = await OrderModel.findById(_id);
      order.products.forEach(async (item) => {
        const product = await ProductModel.findById(item._id);
        if (product.quantity != 0) {
          product.quantity--;
        }
        await product.save();
      });
      order.status_order = true;
      await order.save();
      return res.json({
        statusCode: 200,
        msg: "Duyệt đơn hàng thành công",
      });
    } catch (err) {
      return res.json({
        statusCode: 404,
        msg: "Duyệt đơn hàng thất bại ",
      });
    }
  },
};
