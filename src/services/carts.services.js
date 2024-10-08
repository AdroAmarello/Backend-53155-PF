import cartsRepository from "../persistences/mongo/repositories/carts.repository.js";
import productsRepository from "../persistences/mongo/repositories/products.repository.js";
import error from "../errors/customErrors.js"

const createCart = async () => {
    return await cartsRepository.createCart();
};

const getCartById = async (id) => {
    const cart = await cartsRepository.getCartById(id);
    if (!cart) throw error.notFoundError(`Cart id:${id} not found`);
    return cart
};

const addProductToCart = async (cid, pid, user) => {
    const product = await productsRepository.getProductById(pid);

    if (user.role === "premium" && product.owner === user._id) {
        throw error.unauthorizedError("User not authorized to add this product")
    }

    return await cartsRepository.addProductToCart(cid, pid);
};

const updateQuantityOfProduct = async (cid, pid, quantity) => {
    return await cartsRepository.updateQuantityOfProduct(cid, pid, quantity);
};

const deleteProductFromCart = async (cid, pid) => {
    return await cartsRepository.deleteProductFromCart(cid, pid);
};

const clearCart = async (cid) => {
    const cart = await cartsRepository.clearCart(cid);
    if (!cart) throw error.notFoundError(`Cart id:${id} not found`);
    return cart
};

const purchaseCart = async (cid) => { // creamos el servicio de carrito de compra
    const cart = await cartsRepository.getCartById(cid); // tomamos el carrito mediante el id
    let total = 0;
    const productsWithoutStock = []; // array donde se almacenarán los productos que no tienen stock

    for (const product of cart.products) {
        const prod = await productsRepository.getProductById(product.product);
        if (prod.stock >= product.quantity) { // si el stock del producto es mayor a la cantidad de productos dentro del carrito multiplica el precio del producto por la cantidad en el carrito
            total += prod.price * product.quantity;
        }else {
            productsWithoutStock.push(product); // en caso de que no se cumpla la primer condición pushea el producto en el array 
        }

        //Modificar los productos del carrito
        await cartsRepository.updateCart(cid, productsWithoutStock);
    }

    return total;
}

export default {
    createCart,
    getCartById,
    addProductToCart,
    updateQuantityOfProduct,
    deleteProductFromCart,
    clearCart,
    purchaseCart,
}