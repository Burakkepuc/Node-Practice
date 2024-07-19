const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
require("dotenv").config();

const createToken = async (user, res) => {
  try {
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      algorithm: "HS512",
      expiresIn: "7d"
    })


    return res.status(201).json({
      success: true,
      token,
      message: "Successfull"
    })
  } catch (error) {
    throw new APIError(error.message, 500)

  }
}

const verifyToken = async (req, res, next) => {
  const headerToken = req.headers['authorization'] && req.headers['authorization'].startsWith("Bearer ")

  if (!headerToken) {
    throw new APIError("Geçersiz Oturum, Lütfen Oturum Açın", 401)
  }

  const token = req.headers['authorization'].split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) throw new APIError("Invalid Token", 401)

    req.user = decoded;
    next();
  })
}

module.exports = {
  createToken,
  verifyToken
}