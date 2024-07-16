const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const login = async (req, res) => {
  console.log(req.body);
  return res.json(req.body)
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

module.exports = { login, register }