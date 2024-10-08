import { Router } from "express";
import { authorization, passportCall } from "../middlewares/passport.middlewares.js";
import cartsController from "../controllers/carts.controller.js";
import { checkProductAndCart } from "../middlewares/checkProductAndCart.middlewares.js";
import { isUserCart } from "../middlewares/isUserCart.js";
import { checkId } from "../middlewares/checkId.middlewares.js";

const router = Router();

// creamos solicitud/peticiones

router.get("/:cid", checkId, passportCall("jwt"), authorization(["user", "premium"]), cartsController.getCartById);
router.post("/:cid/product/:pid", checkId, passportCall("jwt"), authorization(["user", "premium"]), isUserCart, checkProductAndCart,  cartsController.addProductToCart);
router.put("/:cid/product/:pid", checkId, passportCall("jwt"), authorization("user"), checkProductAndCart, cartsController.updateQuantityOfProduct);
router.delete("/:cid/product/:pid", checkId, passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsController.deleteProductFromCart);
router.delete("/:cid", checkId, passportCall("jwt"), authorization(["user", "premium"]), cartsController.clearCart);

router.get("/:cid/purchase", checkId, passportCall("jwt"), authorization(["user", "premium"]), cartsController.purchaseCart);

export default router;