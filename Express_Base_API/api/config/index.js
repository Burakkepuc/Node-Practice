module.exports = {
  "PORT": process.env.PORT || 3000,
  "CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/base_api",
  "LOG_LEVEL": process.env.LOG_LEVEL || "debug"

}