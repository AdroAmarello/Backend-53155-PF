// Validación con Joi del id de Mongo
import { request, response } from "express";
import errors from "../errors/customErrors.js";
import joi from "joi";
import { logger } from "../utils/logger.js";


export const checkId = (req = request, res = response, next) => {
    //Expresión regular para un ObjectId de Mongo
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    try {
        const schema = joi.object({
            pid: joi.string().pattern(objectIdRegex).messages({
                "string.pattern.base": "Invalid format of product id"}),
            cid: joi.string().pattern(objectIdRegex).messages({
                "string.pattern.base": "Invalid format of cart id"}),
        })
        
        
        //para validar
        const { error } = schema.validate(req.params);

        
        if (error) {
            throw errors.badRequestError(error.details[0].message)
            
        }
        next();
        } catch (error) {
        logger.warn(error);
        next(error);
    }
}