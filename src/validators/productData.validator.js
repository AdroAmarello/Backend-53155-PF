//? VALIDADOR de productos con joi
import { request } from "express";
import joi from "joi";
import { logger } from "../utils/logger.js";

export const productDataValidator = (req = request, res = response, next) => {
    try {
        const schema = joi.object({
            title: joi.string().required().messages({
                "string.base": "Title must be a string",
                "any.required": "Title is required"
            }),
            description: joi.string().required().messages({
                "string.base": "Description must be a string",
                "any.required": "Description is required"
            }),
            thumbnail: joi.array().messages({
                "array.base": "Thumbnail must be an array",
            }),
            code: joi.string().required().min(3).messages({
                "string.base": "Code must be a string",
                "any.required": "Code is required",
                "string.min": "Code has to be at least 3 characters"
            }),
            stock: joi.number().required().messages({
                "number.base": "Stock must be a number",
                "any.required": "Stock is required"
            }),
            status: joi.boolean().messages({
                "boolean.base": "Status must be a boolean",
            }),
            price: joi.number().required().messages({
                "number.base": "Price must be a number",
                "any.required": "Price is required"
            }),
            category: joi.string().required().messages({
                "string.base": "Category must be a string",
                "any.required": "Category is required"
            }), 
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        };
        next();
    } catch (error) {
        next(error);
        logger.warn(error.message)
    };
};

//? VALIDADOR de productos con Express-Validator
// import { body, validationResult } from "express-validator"
// export const productDataValidator = [
//     body("title")
//     .isString().withMessage("Title must be a string")
//     .isEmpty().withMessage("Title is required"),

//     body("description")
//     .isString().withMessage("Description must be a string")
//     .isEmpty().withMessage("Description is required"),

//     body("thumbnail")
//     .isArray().withMessage("Thumbnail must be an array"),

//     body("code")
//     .isString().withMessage("Code must be a string")
//     .isEmpty().withMessage("Code is required")
//     .isLength( { min: 3}).withMessage("Code has to be at least 3 characters"),

//     body("stock")
//     .isNumeric().withMessage("Stock must be a number")
//     .isEmpty().withMessage("Stock is required")
//     .isLength( { min:1}),

//     body("status")
//     .isBoolean(),

//     body("price")
//     .isNumeric()
//     .withMessage("Price must be a number")
//     .isLength({min: 1})
//     .withMessage("Price has to be at least 1 character")
//     .isEmpty()
//     .withMessage("price is required"),
    
//     (req, res, next) => {
//         const errors = validationResult(req); // validación de lo recibido por request
//         // Verificamos is hay algún error
//         if (!errors.isEmpty()) { // "!error.isEmpty" verifica que el "error" contenga algo de lo contrario no ha habido error
//             // Formateamos respuesta de errores
//             const formatErrors = errors.array().map( e => ({ message: e.msg, data: e.path})) // poniendo () nos ahorramos poner el "return { message: e.message, data: e.path}"

//             return res.status(400).json({status: "error", errors: formatErrors});
//         }

//         //si no hay errores continúa
//         next();
//     },
// ];


