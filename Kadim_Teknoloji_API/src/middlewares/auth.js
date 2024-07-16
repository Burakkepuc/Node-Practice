const jwt = require("jsonwebtoken")
require("dotenv").config();

const createToken = async (user, res) => {
  try {
    const payload = {
      sub: user._id,
      name: user.name
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
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

module.exports = {
  createToken
}