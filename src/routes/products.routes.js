import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { authorization, passportCall } from "../middlewares/passport.middlewares.js";
import { checkId } from "../middlewares/checkId.middlewares.js";
import { productDataValidator } from "../validators/productData.validator.js";

// import productManager from "../dao/fsManagers/productManager.js" importamos el productManager para utilizar las funciones - se cambia el uso de fs por MongoDB

const router = Router();

// solicitud de productos por mocks
router.get("/mockingproducts", productsController.createAndGetProductsMock); // modifiqué la posición de este endpoint para que mongo no interprete que "mockingproducts" es un id

// creamos solicitud/peticiones
router.get("/", productsController.getProducts); 
router.get("/:pid", checkId, productsController.getProductById);


router.post("/", passportCall("jwt"), authorization(["admin", "premium"]), productDataValidator, productsController.createProduct);
router.put("/:pid", checkId, passportCall("jwt"), authorization(["admin", "premium"]), productsController.updateProductById);
router.delete("/:pid", checkId, passportCall("jwt"), authorization(["admin", "premium"]),  productsController.deleteProductById);

export default router;
