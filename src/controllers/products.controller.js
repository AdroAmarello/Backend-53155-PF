import { generateProductsMock } from "../mocks/products.mock.js";
import productsServices from "../services/products.services.js";
import { logger } from "../utils/logger.js";
// importamos la capa de servicios que interactúa con la de repositorio


// lógica de petición de todos los productos o por un límite
async function getProducts(req, res, next) {
	try {
		const { limit, page, sort, category, status } = req.query; // se toma el query y se desestructuran los parámetros de búsqueda opcionales

		const optionsFilter = {
			// creamos un objeto con los parámetros de búsqueda que no poseen condicionales
			limit: limit || 10,
			page: page || 1,
			sort: {
				price: sort === "asc" ? 1 : -1,
			},
			lean: true,
		};

		if (status) {
			//validamos si se solicita el query "status"
			const products = await productsServices.getProducts({ status }, optionsFilter);
			return res.status(200).json({ status: "success", products });
		}

		if (category) {
			//validamos si se solicita el query "category"
			const products = await productsServices.getProducts({ category }, optionsFilter);
			return res.status(200).json({ status: "success", products });
		}
        
        const products = await productsServices.getProducts({}, optionsFilter); // si no ingresa a ninguna de las validaciones anteriores devuelve los productos según "optionsFilter"
		
        res.status(200).json({ status: "success", products });
		
	} catch (error) {
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

// lógica de petición de producto por id
async function getProductById(req, res, next) {
	try {
		const { pid } = req.params; // se desestructura el parámetro id como pid

		const product = await productsServices.getProductById(pid);

		return res.json({ status: 200, response: product }); // se muestra el producto con el id correspondiente
		
	} catch (error) {
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

//lógica de petición de productos del Mock
async function createAndGetProductsMock(req, res) { // controller para inyectar 100 productos generados con faker
	const products = generateProductsMock(100);

	res.status(200).json({ status: "success", products });
	
};

// lógica de carga de un nuevo producto
async function createProduct(req, res, next) {
	try {
		const product = req.body;

		const newProduct = await productsServices.createProduct(product, req.user);

		res.status(201).json({ status: "success", response: newProduct });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

// lógica de modificación de un producto
async function updateProductById(req, res, next) {
	try {
		const { pid } = req.params; // captura el parámetro
		const dataProduct = req.body; // captura el objeto con las modificaciones

		const updateProduct = await productsServices.updateProductById(pid, dataProduct);

		res.status(200).json({ status: "success", response: updateProduct });
	} catch (error) {
		logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

// lógica para eliminar un producto
async function deleteProductById(req, res, next) {
	try {
		const { pid } = req.params;

		const product = await productsServices.deleteProductById(pid, req.user); // guardamos la respuesta en una constante que sera de tipo boolean
		res.status(200).json({ status: "success", response: `El producto con ID ${pid} ha sido eliminado`}); // se asigna código de status y se informa la eliminación
		
	} catch (error) {
		logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
	createAndGetProductsMock,
}