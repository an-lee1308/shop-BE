const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sendmail = require("../helpers/sendmail");
require("dotenv").config();

const saltRounds = 10;
const { url_verifyEmail } = process.env;

module.exports = {
  registerUser: async (req, res) => {
    const { username, password, phone, email } = req.body;
    console.log(req.body, username);
    const checkUserName = await UserModel.find({ username });
    const checkEmail = await UserModel.find({ email });
    console.log("cgeck", checkUserName);
    if (checkUserName && checkUserName.length > 0) {
      return res.json({
        statusCode: 404,
        msg: "Tên tài khoản đã được đăng ký",
      });
    }
    if (checkEmail.length > 0) {
      return res.json({
        statusCode: 404,
        msg: "Email đã được đăng ký",
      });
    }
    if (username.length <= 6 || password.length <= 6) {
      return res.json({
        statusCode: 404,
        msg: "Mật khẩu và tài khoản phải nhiều hơn 6 kí tự",
      });
    }
    const HashPassword = bcrypt.hashSync(password, saltRounds);
    const NewUser = new UserModel({
      username,
      password: HashPassword,
      name: username,
      phone,
      email,
      role: "USER",
      image:
        "https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_632,h_316/https://gocsuckhoe.com/wp-content/uploads/2020/09/avatar-facebook-632x316.jpg",
      verificationcode: randomstring.generate(16),
      enable: false,
    });
    try {
      const user = await NewUser.save();
      sendmail.VerifyEmail(email, url_verifyEmail + user.verificationcode);
      return res.json({
        statusCode: 200,
        msg: "Tạo tài khoản thành công",
      });
    } catch (e) {
      console.log(e);
    }
    {
      return res.json({
        statusCode: 404,
        msg: err,
      });
    }
  },
};
