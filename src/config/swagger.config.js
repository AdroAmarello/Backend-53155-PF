import __dirname from "../../dirname.js";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de API E-commerce",
            version: "1.0.1",
            description: "API E-commerce de productos para el curso de Backend de Coderhouse"
        },
    },
    apis:[`${__dirname}/src/docs/**/*.yaml`]
}

export const swaggerDocs = swaggerJSDoc(swaggerOptions)