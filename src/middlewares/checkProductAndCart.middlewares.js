import { request, response } from "express";
import cartsServices from "../services/carts.services.js";
import productsServices from "../services/products.services.js";
import error from "../errors/customErrors.js"

export const checkProductAndCart = async (req = request, res= response, next) => {
    const { cid, pid } = req.params;
    const product = await productsServices.getProductById(pid);
    const cart = await cartsServices.getCartById(cid)

    //? if(!product) return res.status(404).json({ status: "Error", response: `Product with id ${pid} not found`}); // validación si existe el pid
    if(!product) throw error.notFoundError(`Product with id ${pid} not found`)
    if(!cart) throw error.notFoundError(`Cart with id ${cid} not found`); // validación si existe el cid

    next();
};