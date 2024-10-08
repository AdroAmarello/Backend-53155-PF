// importamos el módulo FileSystem
import fs from "fs";

// Declaramos un array vacío que va a contener los productos que ingrese el usuario
let products = [];
// Declaramos una variable que va a contener la ruta donde se creará nuestro archivo con la información ingresada en la carpeta raíz donde está el archivo app  
let pathFile = "./src/data/products.json";


// Se crea la función "addProduct" para añadir productos al array 
// Se declara la función addProduct como asíncrona 
const addProduct = async (product) => {
    const { title, description, price, thumbnail, code, category, stock } = product; // se crea un objeto con las propiedades desestructuradas
    await getProducts(); // se llama a la función para mostrar productos
	// Creamos un objeto con las propiedades solicitadas
	const newProduct = {
		id: products.length + 1, //Id del producto auto-incrementable 
		title,
		description,
		price,
		thumbnail,
		code,
        category,
		stock,
        status: true
	};

    // Validación de que la codificación de cada producto no se repita, en caso de repetición de código no agrega el producto al array
	const productExists = products.find((product) => product.code === code);
	if (productExists) {
		console.log(
			`El producto ${title} con el código ${code} ya existe`
		);
        throw Error (`El producto ${title} con el código ${code} ya existe`);
		return;
	}

    // Validación de que todos los campos sean ingresados correctamente mediante la verificación de que ninguna propiedad obtenga como valor "undefined"
    if(Object.values(newProduct).includes(undefined)) {
        console.log("Todos los campos son obligatorios");
        throw Error ("Todos los campos son obligatorios")
        return;
    }

    // Realizadas las validaciones se procede a la carga del producto ingresado por el usuario al array "products"
	products.push(newProduct);

    // Una vez pusheado el producto en el array "products" se escribe en el archivo "products.json" mediante el módulo fs.promises.writeFile y se utiliza el JSON.stringify para que no quede como texto plano
    
    await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

// Función que permite obtener los productos del .json
// Se convierte la función "getProduct" en asíncrona
const getProducts = async (limit) => { // se agrega el query por parámetro
	const productsJson = await fs.promises.readFile(pathFile, "utf-8") // Se declara el array "productsJson" con los elementos tomados del archivo "products.json"
    products = JSON.parse(productsJson) || []; // Se le asigna al array "products" el contenido proveniente del "productsJson" y convertido con el "JSON.parse" y en el caso de que no existiese "productJson" se asigna un array vacío
    
    if (!limit) return products; // se verifica si no existe un query (limit) se muestran todos los productos

    return products.slice(0, limit); // en caso de existir un query retorna un objeto modificado 
};

// Función que permite buscar dentro del array un producto a través del Id ingresado por parámetro
// Se convierte la función "getProductById" en asíncrona
const getProductById = async (pid) => {
    // Para realizar la búsqueda primero se tienen que obtener los productos del archivo ".json"
    await getProducts();
    // Se crea objeto con el método find para comprobar si el id existe dentro del array
    const product = products.find( product => product.id === pid);
    // Si no encuentra el id entonces no existe el elemento y lo informa por consola
    if (!product) {
        console.log(`No se encontró el producto con el id ${pid}`);
        return;
    }

    // En caso de encontrar el id muestra por consola el producto correspondiente
    console.log(product);
    return product;
};

// Función que permite modificación de propiedades de un producto sin alterar el ID

const updateProductById = async (pid, dataProduct) => {
    await getProducts(); // se traen los productos del archivo .json

    const index = products.findIndex((product) => product.id === pid); // se busca el producto cuyo id coincida con el ingresado
    
    
    products[index] = {
        ...products[index],
        ...dataProduct
    } // encontrado el producto se le asigna una copia (operador spread) del producto que se encuentra en ese index y si existen las propiedades ingresadas se sobreescriben y si no se crean
    

    await fs.promises.writeFile(pathFile, JSON.stringify(products)); // se sobreescribe el archivo con las nuevas modificaciones
    console.log(products[index]); // Se muestra por consola el producto modificado
}

// Función que permite eliminar el producto según su ID
const deleteProductById = async (id) => {
    await getProducts();
    products = products.filter( product => product.id !== id); // se asigna al array "products" los elementos que no posean el id ingresado
    await fs.promises.writeFile(pathFile, JSON.stringify(products)); // se sobreescribe el archivo eliminando el producto según el id ingresado

}

export default {
    addProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
};