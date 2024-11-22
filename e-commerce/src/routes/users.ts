import { Request, Response } from "express";

import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";

import adminMiddleware from "../middlewares/admin";
import UsersController from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(UsersController.addAddress));
usersRoutes.delete('address/:id', [authMiddleware], errorHandler(UsersController.deleteAddress));
usersRoutes.get('/address', [authMiddleware], errorHandler(UsersController.listAddress));
usersRoutes.put('/', [authMiddleware], errorHandler(UsersController.updateUser));
usersRoutes.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(UsersController.changeUserRole));
usersRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(UsersController.listUsers));
usersRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(UsersController.getUserById));


export default usersRoutes;