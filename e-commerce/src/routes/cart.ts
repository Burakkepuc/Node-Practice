import { Router } from "express";
import LoginController from "../controllers/auth";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import CartsController from "../controllers/cart";

const cartRoutes: Router = Router();
cartRoutes.post('/', authMiddleware, errorHandler(CartsController.addItemToCart))
cartRoutes.get('/', authMiddleware, errorHandler(CartsController.getCart))
cartRoutes.delete('/:id', authMiddleware, errorHandler(CartsController.deleteItemFromCart))
cartRoutes.put('/:id', authMiddleware, errorHandler(CartsController.changeQuantity))

export default cartRoutes;