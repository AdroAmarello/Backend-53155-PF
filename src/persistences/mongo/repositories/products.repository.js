import { productsModel } from "../models/products.model.js"; // importamos el productsModel para utilizar los modelos para interactuar con la base de datos

const getProducts = async (query, options) => { // creamos una función para traer todo
    const products = await productsModel.paginate(query, options); // utilizamos el método paginate para traer los productos según parámetros y para obtener los datos de total de páginas, el número de página, etc.
    
    return products;
};

const getProductById = async (id) => {
	const product = productsModel.findById(id); // utilizamos el método findById para traer un elemento por id
    return product;
};

const createProduct = async (data) => {
	const product = productsModel.create(data); // utilizamos el método create para crear un producto
    return product;
};

const updateProductById = async (id, data) => {
	
    const product = await productsModel.findByIdAndUpdate(id, data, {new: true}); // utilizamos el método findByIdAndUpdate para actualizar el elemento primero
    return product;
};


const deleteProductById = async (id) => {
	const product = await productsModel.deleteOne({_id: id}); // utilizamos el método deleteOne con un parámetro de búsqueda para eliminar el producto con el id que coincida con la propiedad id del elemento
    if(product.deletedCount === 0) return false; // comprobamos si se efectuó la eliminación del producto.
    return true; // sólo devolvemos un true porque no me interesa que me retorne el elemento eliminado
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}