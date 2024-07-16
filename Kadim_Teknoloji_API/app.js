require("express-async-errors")
const express = require("express")
const app = express()
const router = require('./src/routers')
const errorHandlerMiddleware = require("./src/middlewares/errorHandler")
const APIError = require("./src/utils/errors")
require("dotenv").config()
require("./src/db/dbConnection")
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.json({
    message: "Hoş geldiniz"
  })
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api", router)
app.use(APIError) // Global Error Handler 
app.use(errorHandlerMiddleware) // Throw new Error

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
})