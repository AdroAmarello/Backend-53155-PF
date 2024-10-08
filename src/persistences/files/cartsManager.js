// Creamos un cartManager para manejar el carrito de la misma manera que como hicimos con los productos
import fs from 'fs';

let carts = [];
let pathFile = "../data/cart.json";

//Función para obtener los carritos del cart.json
const getCarts = async () => {
    const cartsJson = await fs.promises.readFile(pathFile);
    carts = JSON.parse(cartsJson) || [];

    return carts;
}
//Función para crear un carrito
const createCart = async () => { 
    await getCarts();

    const newCart = {
        id: carts.length + 1,
        products: []
    }

    carts.push(newCart);

    await fs.writeFile(pathFile, JSON.stringify(newCart));
    
    return newCart;
}
//Función para obtener un carrito por ID
const getCartById = async (cid) => {
    await getCarts();

    const cart = carts.find( cart => cart.id === cid);
    if (!cart) {
        console.log(`No se encontró el carrito con el id: ${cid} `);
        return;
    }
    console.log(cart);
    return cart;
}

//Función para agregar un producto por pid a un carrito con cid 

const addProductToCart = async (cid, pid) => {
    await getProducts();

    const cIndex = carts.findIndex(cart => cart.id === cid);
    if (cIndex === -1) return `No se encontró el carrito con el id ${cid}`;
    
    const pIndex = carts.products.findIndex(product => product.id === pid);
    
    if (pIndex !== -1) {
        carts[cIndex].products[pIndex].quantity++
    }
    
    carts[cIndex].products.push({
        product: pid,
        quantity: 1
    });

    return carts[cIndex]
}

export default {
    createCart,
    getCarts,
    getCartById,
    addProductToCart
}