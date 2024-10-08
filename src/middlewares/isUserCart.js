//Creamos un middleware para verificar si el carrito es del usuario
import { request, response } from "express";
import errors from "../errors/customErrors.js";

export const isUserCart = async (req= request, res = response, next) => {
    const  {cid} = req.params;
    if(req.user.cart !== cid) {
        
        //?  throw errors.unauthorizedError(`The cart with id ${cid} does not belong to the user`); //PREGUNTAR
        res.status(401).json({status: "Error", msg: `The cart with id ${cid} does not belong to the user`});
    }         
    next();
};