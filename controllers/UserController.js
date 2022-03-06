const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sendmail = require("../helpers/sendmail");
const jwt = require("../helpers/jwt");
require("dotenv").config();

const saltRounds = 10;
const { TIME_SECRET, SECRETKEY, url_verifyEmail, url_changePassord } =
  process.env;

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
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const checkUsername = await UserModel.findOne({
        username,
      });
      if (!checkUsername.enable) {
        return res.json({
          statusCode: 404,
          msg: "Tài khoản chưa được kích hoạt vui lòng đăng nhập vào gmail để kích hoạt",
        });
      }
      if (bcrypt.compareSync(password, checkUsername.password)) {
        const token = await jwt.generateToken(
          checkUsername,
          SECRETKEY,
          TIME_SECRET
        );
        return res.json({
          statusCode: 200,
          jwt: token,
          msg: "Đăng nhập thành công",
        });
      } else {
        return res.json({
          statusCode: 404,
          msg: "Mật khẩu không chính xác! vui lòng nhập lại mật khẩu",
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        statusCode: 403,
        msg: "Tài khoản không tồn tại",
      });
    }
  },
  verifyCode: async (req, res) => {
    const { code } = req.params;
    try {
      const user = await UserModel.findOne({
        verificationcode: code,
      });

      user.enable = true;
      await user.save();
      res.send("<h1 style='text-align:center'>Kích hoạt thành công</h1>");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getUser: async (req, res) => {
    const { _id } = req.user.data;
    try {
      const user = await UserModel.findById(_id);
      res.json({
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        image: user.image,
        role: user.role,
        ngaysinh: user.ngaysinh,
        sex: user.sex,
        enable: user.enable,
        id: user.id,
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
