const express = require('express');
const { login, register, me } = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)

router.get("/me", verifyToken, me)


module.exports = router;

