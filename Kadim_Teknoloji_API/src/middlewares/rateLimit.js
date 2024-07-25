const rateLimit = require("express-rate-limit")

const allowList = ["::ffff:127.0.0.1"];

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  skip: (req, res) => allowList.includes(req.ip),
  max: (req, res) => {
    console.log("api url: ", req.url);
    console.log("api ip: ", req.ip);
    if (req.url === "/login" || req.url === "/register") return 5
    else 100
  },
  message: {
    success: false,
    message: "Çok fazla istekte bulundunuz !"
  },
  standartHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter