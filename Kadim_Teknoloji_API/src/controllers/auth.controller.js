const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken, createTempToken, decodedTempToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment");

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const userCheck = await User.findOne({ email })

    if (!userCheck) {
      throw new APIError("Email ya da şifre hatalıdır.", 401)
    }

    const comparePassword = await bcrypt.compare(password, userCheck.password)

    if (!comparePassword) {
      throw new APIError("Email ya da şifre hatalıdır.")
    }

    createToken(userCheck, res)
  } catch (error) {
    throw new APIError(error.message, 500)
  }

}


const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await User.findOne({ email })

  if (userCheck) {
    throw new APIError("A user with this email already exists. Please use a different email address.", 401)
  }

  req.body.password = await bcrypt.hash(req.body.password, 10)
  console.log("hash şifre :" + req.body.password);

  const userObj = {
    email,
    lastname: req.body.lastname,
    name: req.body.name,
    password: req.body.password,
  }

  const user = new User(userObj)
  await user.save().then((data) => {
    // res.status(201).json({ success: true, data: response, message: "Register done" }))
    return new Response(data, "Register process is done").created(res)
  })
    .catch(err => {
      throw new APIError("Register is not done !", 400)
    })

}

const me = async (req, res) => {
  console.log("Me fonksiyonun içerisi");
  return new Response(req.user).success(res)

}

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userCheck = await User.findOne({ email }).select("name lastname email")

    if (!userCheck) return new APIError("Geçersiz kullanıcı", 400).send(res)

    const resetCode = crypto.randomBytes(3).toString("hex")
    userCheck.reset.code = resetCode;
    userCheck.reset.time = moment(new Date()).add(15, "minutes").format("YYYY-MM-DD HH:mm:ss");

    await userCheck.save()

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: userCheck.email,
      subject: "Password Reset",
      text: `Password Reset Code is ${resetCode}`
    })


    return new Response(true, "Mail kutunuzu kontrol edin").success(res)
  } catch (error) {
    console.log(error);
  }


}

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userCheck = await User.findOne({ email }).select("_id reset")

  if (!userCheck) throw new APIError("Invalid Code !", 401)

  const dbTime = moment(userCheck.reset.time)
  const nowTime = moment();

  const timeDiff = dbTime.diff(nowTime, "m")

  console.log("Zaman farkı: ", timeDiff);

  if (timeDiff <= 0 || userCheck.reset.code !== code) {
    throw new APIError("Geçersiz Kod", 401)
  }

  const tempToken = await createTempToken(userCheck._id, userCheck.email)

  return new Response(tempToken, "You can reset password.").success(res)

}

const resetPassword = async (req, res) => {
  try {
    const { password, tempToken } = req.body;

    const decodedToken = await decodedTempToken(tempToken)
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decodedToken._id,
      {
        reset: {
          code: null,
          time: null
        },
        password: hashedPassword
      }
    );

    return new Response(decodedToken, "Şifre Sıfırlama Başarılı").success(res)
  } catch (error) {
    return new APIError("Bir hata oluştu", 500).send(res);

  }
}

module.exports = { login, register, me, forgetPassword, resetCodeCheck, resetPassword }