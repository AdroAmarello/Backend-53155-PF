//Creamos un middleware para verificar si el usuario se encuentra logueado para que pueda ver todos los productos

import { request, response } from "express";

export const isLogin = async (req= request, res = response, next) => {

    if(req.session.user) { // si encuentra el usuario continua con el código
        next();
    } else {
        res.status(401).json({ status: "Error", message: "Usuario no logueado"})
    }
}