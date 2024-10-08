import mongoose from "mongoose";

const cartsCollection = "carts"; // creamos colección de carritos

const cartsSchema = new mongoose.Schema({
	// creamos un esquema cómo será el carrito
	products: {
		type: [ // Realizamos el modelo de carrito con un array con la propiedad "product" de tipo método de mongoose que relacione el carrito con la referencia "products" y agregamos la propiedad "quantity" de tipo número
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
				quantity: Number,
			},
		],
	},
});

cartsSchema.pre("find", function() { // creamos el middleware para que cuando se utilice el find se haga el populate y nos muestre los productos que tiene el carrito
    this.populate("products.product");
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
