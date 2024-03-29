const OrderModel = require("../model/OrderModel");
const ProductModel = require("../model/ProductModel");
require("dotenv").config();
const randomstring = require("randomstring");

function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}

module.exports = {
  paymentOnline: async function (req, res) {
    const { address, products, payment, price } = req.body;
    const { _id } = req.user.data;

    const totalPrice = products.reduce((a, b) => {
      return a + b.newprice * b.soluong;
    }, 0);
    const order = new OrderModel({
      products,
      address,
      payment,
      timeorder: Date.now(),
      status_order: false,
      id_user: _id,
      totalPrice,
    });
    var orderSave = await order.save();
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var dateFormat = require("dateformat");

    var tmnCode = process.env.vnp_TmnCode;
    var secretKey = process.env.vnp_HashSecret;
    var vnpUrl = process.env.vnp_Url;
    var returnUrl = process.env.vnp_ReturnUrl;
    var date = new Date();
    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = orderSave._id + "_" + randomstring.generate(5);
    var amount = price;
    var bankCode = "NCB";

    var orderInfo = "Thanh toan san pham";
    var locale = "vn";
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = 1;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = bankCode;

    vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
    console.log(vnpUrl);

    //Neu muon dung Redirect thi dong dong ben duoi
    res.status(200).json({ code: "00", data: vnpUrl });
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
    //res.redirect(vnpUrl)
  },
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
