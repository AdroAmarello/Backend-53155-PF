import mongoose from "mongoose";

const usersCollection = "user"; // creamos colección de usuarios

const usersSchema = new mongoose.Schema({
	// creamos un esquema cómo será el usuario
	firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true // establecemos que el email será del tipo string y que tendrá la propiedad "unique" en true para que no se pueda repetir otro usuario con el mismo correo
    },
    password: String,
    age: Number,
    role: { // agregamos el role para el usuario
        type: String,
        enum: ["user", "admin" , "premium"], // con "enum" definimos los roles que puede tomar el usuario
        default: "user", // y por defecto seleccionamos el role "user"
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    documents:[{ name: String, reference: String }],
    last_connection: Date,
});

export const usersModel = mongoose.model(usersCollection, usersSchema);
