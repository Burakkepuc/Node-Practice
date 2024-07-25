const express = require('express');
const { login, register, me, forgetPassword, resetCodeCheck, resetPassword } = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)

router.post("/forget-password", forgetPassword)
router.post("/reset-code-check", resetCodeCheck)
router.post("/reset-password", resetPassword)
router.get("/me", verifyToken, me)


module.exports = router;

