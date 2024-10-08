import cartsServices from "../services/carts.services.js";
import ticketsServices from "../services/tickets.services.js";
import { logger } from "../utils/logger.js";


//lógica para crear un carrito
async function createCart (req, res, next) {
    try {
        const cart = await cartsServices.createCart();

        res.status(201).json({status: "success", payload: cart});

    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler"
    }
}; 

//lógica de petición un carrito por id
async function getCartById (req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartsServices.getCartById(cid);
        
        return res.status(200).json({ status: "success", payload: cart}) // se muestra el carrito con el id correspondiente

    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler"
    }
}; 

//lógica para añadir un producto al carrito
async function addProductToCart (req, res, next) {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsServices.addProductToCart(cid, pid, req.user);
                
        return res.status(200).json({ status: "success", response: cart}); // se muestra el carrito con el id correspondiente
        
    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler"
    }
};

//lógica para modificar la cantidad de un producto al carrito ingresada desde el body
async function updateQuantityOfProduct (req, res, next) {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartsServices.updateQuantityOfProduct(cid, pid, quantity);
        
        return res.status(200).json({ status: "success", response: cart}); // se muestra el carrito con el id correspondiente
            
    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler" 
    }
};

//lógica para eliminar un producto del carrito
async function deleteProductFromCart (req, res, next) {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsServices.deleteProductFromCart(cid, pid);
        
        return res.status(200).json({ status: "success", response: cart}); // se muestra el carrito con el id correspondiente
        
    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler"
    }
};

//lógica para eliminar todos los productos del carrito
async function clearCart (req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartsServices.clearCart(cid);

        res.json({ status: 200, response: `Cart with id ${cid} is empty`, payload: cart}) // se muestra el carrito con el id correspondiente

    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler" 
    }
}; 

//lógica de compra de carrito
async function purchaseCart (req, res) {
    try {
        const { cid } = req.params;
        
        // obtener el total del carrito
        const total = await cartsServices.purchaseCart(cid);

        //crear el ticket
        const ticket = await ticketsServices.createTicket(req.user.email, total);
        
        res.json({ status: 200, response: ticket }) // se muestra el carrito con el id correspondiente

    } catch (error) {
        logger.error(error);
        next(error); // Error manejado con el middleware "errorHandler"
    }
}

export default {
    createCart,
    getCartById,
    addProductToCart,
    updateQuantityOfProduct,
    deleteProductFromCart,
    clearCart,
    purchaseCart
}