const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation')
const router = express.Router();

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)


module.exports = router;

