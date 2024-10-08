import { body, validationResult } from "express-validator"

export const userLoginValidator = [
    
    body("email")
    .isEmail().withMessage("Please enter valid email address")
    .notEmpty().withMessage("Email is required"), // la coma separa cada propiedad que llega
    body("password")
    .notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req); // validación de lo recibido por request
        // Verificamos is hay algún error
        if (!errors.isEmpty()) { // "!error.isEmpty" verifica que el "error" contenga algo de lo contrario no ha habido error
            // Formateamos respuesta de errores
            const formatErrors = errors.array().map( e => ({ message: e.msg, data: e.path})) // poniendo () nos ahorramos poner el "return { message: e.message, data: e.path}"

            return res.status(400).json({status: "error", errors: formatErrors});
        }

        //si no hay errores continúa
        next();
    },
    
];