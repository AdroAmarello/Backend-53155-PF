import { userResponseDto } from "../dto/user-response.dto.js";
import { createToken } from "../utils/jwt.js";


//Lógica de registro
const userRegister = async (req, res, next) => {
	try {
		//Delegamos la responsabilidad del registro a Passport

		res.status(201).json({ status: "success", msg: "Usuario registrado"});
	} catch (error) {
		logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

//Lógica de login con JWT
const userLoginJWT = async (req, res, next) => {
	try {

		const user = req.user;
		user.last_connection = new Date();
		const token = createToken(user)

		//Seteamos el token en una cookie 
		res.cookie("token", token, { httpOnly: true}); //guardamos el token en una cookie y agregamos el "httpOnly" como seguridad para que no puedan ingresar a la cookie si no es por una petición http
		const userDto = userResponseDto(user);
		return res.status(200).json({ status: "success", payload: userDto, token });
		
	} catch (error) {
        logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

//Lógica de login con Google
const userLoginGoogle = async (req, res, next) => {
	try {
		return res.status(200).json({ status: "success", payload: req.user });
		
	} catch (error) {
        logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
	}
};

//lógica de chequeo de session
const userCurrent = (req, res, next) => {
	try {
		const user = userResponseDto(req.user)
		return res.status(200).json({ status: "success", payload: user });

	} catch (error) {
		logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
		
	}
};

//lógica de logout de usuario
const userLogout = async (req, res, next) => {
    try {
        req.session.destroy(); // utilizamos el método destroy para eliminar la session
        
        res.status(200).json({ status: "success", response: "Sesión cerrada con éxito" });
        
        
    } catch (error) {
        logger.error(error);
		next(error); // Error manejado con el middleware "errorHandler"
        
    }
}

export default {
    userRegister,
    userLoginJWT,
    userLoginGoogle,
    userCurrent,
    userLogout
}