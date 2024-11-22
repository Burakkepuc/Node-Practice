import { Router } from "express";
import LoginController from "../controllers/auth";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";

const authRoutes: Router = Router();
authRoutes.post('/signup', errorHandler(LoginController.signup));
authRoutes.post('/login', errorHandler(LoginController.login))
authRoutes.get('/me', authMiddleware, errorHandler(LoginController.me))

export default authRoutes;