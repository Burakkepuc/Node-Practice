import { Router } from "express";
import LoginController from "../controllers/auth";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import OrdersController from "../controllers/orders";
import adminMiddleware from "../middlewares/admin";

const ordersRoutes: Router = Router();
ordersRoutes.post('/', authMiddleware, errorHandler(OrdersController.createOrder))
ordersRoutes.get('/', authMiddleware, errorHandler(OrdersController.listOrders))
ordersRoutes.put('/:id/cancel', authMiddleware, errorHandler(OrdersController.cancelOrder))

ordersRoutes.get('/users/:id', authMiddleware, errorHandler(OrdersController.listUserOrders))
ordersRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(OrdersController.listAllOrders))
ordersRoutes.put('/:id/status', authMiddleware, errorHandler(OrdersController.changeStatus))
ordersRoutes.get('/:id', authMiddleware, errorHandler(OrdersController.getOrderById))

export default ordersRoutes;