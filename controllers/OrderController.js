const OrderModel = require("../model/OrderModel");
require("dotenv").config();

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
};
