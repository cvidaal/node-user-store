import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const controller = new ProductController(productService);

    // Definir las rutas
    router.get("/", controller.getProducts);
    router.post("/", [AuthMiddleware.validateJWT], controller.createProduct);

    return router;
  }
}
