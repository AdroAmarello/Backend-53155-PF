import jwt from "jsonwebtoken";
import envs from "../config/env.config.js";

// Crear el token
export const createToken = (user) => { // recibe el usuario
    const { _id, firstName, email, role, cart} = user; // desestructuramos el id y el mail para cifrar en el token
    const token = jwt.sign( {_id, firstName, email, role, cart}, envs.CODE_SECRET, {expiresIn: "1m"} );
    return token;
}


// No utilizamos esta función porque ya realiza la verificación passport
// Verifica el token
// export const verifyToken = (token) => { // recibe el token
//     try {
//         const decode = jwt.verify(token, "codigoSecreto"); // colocamos el mismo "codigoSecreto" para decodificar el token
//         return decode;
//     } catch (error) {
//         return null; // ponemos "null" para que salte el error que cargamos en el endpoint cuando no existe el token
//     }
// }
