import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    // Definir las rutas
    router.get("/", controller.getCategories);
    // Agregamos el middleware como segundo argumento, como objeto por si tenemos más de uno.
    router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);

    return router;
  }
}
