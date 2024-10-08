import { cartsModel } from "../models/carts.model.js";

const getCartById = async (id) => {
    const cart = await cartsModel.findById(id); // utilizamos el método findById para traer un elemento por id
    return cart;
};

const createCart = async (data) => {
    const cart = cartsModel.create(data); // utilizamos el método create para crear un carrito
    return cart;
};

//Función para agregar un producto por pid a un carrito con cid 

const addProductToCart = async (cid, pid) => {
    const productInCart = await cartsModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": 1}}, {new: true}) // con el cid podemos ubicar el carrito y en caso de encontrarlo incrementamos en 1 con "$inc" en la propiedad "quantity" el producto dentro del array products
    if(!productInCart) { // en caso de que no exista el producto lo pushueamos con el método "$push" y establecemos el "quantity" en 1 para ingresar el producto por primera vez
    return await cartsModel.findOneAndUpdate({ _id: cid}, { $push : { products: {product: pid, quantity: 1}}}, {new: true})
    }
    
    return productInCart;
};

//lógica para modificar la cantidad de un producto del carrito ingresado por body
const updateQuantityOfProduct = async (cid, pid, quantity) => {
    
    const cartUpdated = await cartsModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$set: {"products.$.quantity": quantity}}, {new: true}); // se busca en el carrito el producto "pid" en el array de productos del carrito "cid" y se le establece la cantidad ingresada por el body, y el método "new" en true devuelve el elemento actualizado

    return cartUpdated;
};

//Función para eliminar un producto por pid de un carrito con cid 
const deleteProductFromCart = async (cid, pid) => {
    
        
    let cartUpdated = await cartsModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": -1}}, {new: true}); // se busca en el carrito el producto "pid" en el array de productos del carrito "cid" y decrementa "quantity" en 1 y el método "new" en true devuelve el elemento actualizado; se declara "cartUpdated" como "let" para tener la posibilidad de modificar el contenido si algún producto llega a cantidad 0

     // Obtenemos el índice del producto en el array del carrito
    const productIndex = cartUpdated.products.findIndex(p => p.product.toString() === pid);

    // Verificamos si la cantidad del producto llegó a 0
    if (cartUpdated.products[productIndex].quantity <= 0) {
        // Eliminamos el producto del array del carrito 
        cartUpdated = await cartsModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { product: pid } } },{ new: true });
    }

    return cartUpdated;
};



//lógica para eliminar todos los productos de un carrito determinado por "cid"
const clearCart = async (cid) => {
    const cartEmpty = await cartsModel.findOneAndUpdate({_id: cid}, {$set: {"products": []}}, {new: true});
    
    return cartEmpty;
};

//Lógica para modificar el carrito
const updateCart = async (cid, products) => {
    const cart = await cartsModel.findByIdAndUpdate(cid, {$set: {products}}, {new: true});

    return cart;
}

export default {
    getCartById,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    updateQuantityOfProduct,
    clearCart,
    updateCart
}