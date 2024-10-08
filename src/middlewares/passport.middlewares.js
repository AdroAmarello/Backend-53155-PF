import { request, response } from "express";
import passport from "passport";
import customErrors from "../errors/customErrors.js";
import { logger } from "../utils/logger.js";


export const passportCall = (strategy) => { // creamos una función que va a recibir una estrategia
    
    return async (req=request , res=response, next) => { // utilizamos una función de orden superior que nos retorna una función asíncrona

        passport.authenticate(strategy, {session: false}, (error, user, info) => {
            
            if(error) return next(error);
            if(!user) return res.status(401).json({status: "error", message: info.message ? info.message : info.toString()}); // validamos que si no obtenemos el usuario no muestre el mensaje configurado en la estrategia, y si no hay mensaje configuramos que llegue me lo transforme en un String
            
            req.user = user; // si no llega un error o no llega un mensaje de error asignamos "user" a req.user

            next();
        })(req, res, next);

    }; 
};

export const authorization = (roles) => { // con la función "authorization" verificamos si tienen permisos según el "role" que tenga el usuario

    return async (req = request, res = response , next) => {
        try {
            if (!req.user) throw customErrors.notFoundError("User not found");
            const roleAuthorized = roles.includes(req.user.role);
            if (!roleAuthorized) throw customErrors.unauthorizedError("User not authorized");
            
            next();

        } catch (error) {
            logger.error(error);
            next(error);
            
        }
        
    }
}

