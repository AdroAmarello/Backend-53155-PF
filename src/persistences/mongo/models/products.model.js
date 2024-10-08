import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // importamos mongoosePaginate

const productCollection = "products"; // creamos colección de productos

const productSchema = new mongoose.Schema({
	// creamos un esquema cómo será el producto
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	thumbnail: {
		type: Array,
		default: [],
	},
	code: {
		type: String,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	owner:{
		type: String,
		default: "admin"
	}
});

productSchema.plugin(mongoosePaginate); // agregamos el plugin de mongoose para hacer la paginación 

export const productsModel = mongoose.model(productCollection, productSchema);
