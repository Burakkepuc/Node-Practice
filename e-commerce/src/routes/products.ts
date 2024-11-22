import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import ProductsController from "../controllers/products";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();
productsRoutes.post('/create', [authMiddleware, adminMiddleware], errorHandler(ProductsController.createProduct));
productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(ProductsController.updateProduct));
productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(ProductsController.deleteProduct));
productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(ProductsController.getProductById));
productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(ProductsController.listProducts));
productsRoutes.get('/search', [authMiddleware, adminMiddleware], errorHandler(ProductsController.searchProducts));


export default productsRoutes;