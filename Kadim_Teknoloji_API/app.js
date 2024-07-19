require("express-async-errors")
const express = require("express")
const app = express()
const router = require('./src/routers')
const errorHandlerMiddleware = require("./src/middlewares/errorHandler")
const APIError = require("./src/utils/errors")
const cors = require("cors")
const corsOptions = require("./src/helpers/corsOptions")
const mongoSanitize = require("express-mongo-sanitize")
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

// app.use(cors(corsOptions))
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
app.use("/api", router)
app.use(APIError) // Global Error Handler for invalid route names
app.use(errorHandlerMiddleware) // Throw new Error

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
})