import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);

    // Middleware que se aplica a todas las rutas
    router.use([FileUploadMiddleware.containFiles]);

    // Definir las rutas
    // api/upload/single/<user|category|product>/
    // api/upload/multiple/<user|category|product>/
    router.post("/single/:type", controller.uploadFile);
    router.post(
      "/multiple/:type",
      [TypeMiddleware.validTypes(['"users", "products", "categories"'])], // Hay que ponerlo aquí porque si lo ponemos antes no tenemos el req.body.params
      controller.uploadMultipleFiles
    );

    return router;
  }
}
