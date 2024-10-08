import express from 'express'; // importamos el módulo de express para crear el servidor
import router from './src/routes/index.js'; // importamos el router principal
import { connectMongoDB } from './src/config/mongoDb.config.js';
import session from "express-session"; // importamos el módulo de session
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import cookieParser from 'cookie-parser';
import envs from "./src/config/env.config.js"
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express"; // importamos el módulo de swagger Ui Express
import { errorHandler } from './src/errors/errorHandle.js';
import { logger } from './src/utils/logger.js';
import { swaggerDocs } from './src/config/swagger.config.js'; // importamos la configuración de swagger

connectMongoDB(); // llamamos a la función para conectar con la base de datos de mongo
//para crear una aplicación/servidor de express

const app = express();

const urlDbMongo = envs.MONGO_URL; // utilizar url de Mongo 
//para configurar el servidor con determinadas funcionalidades se aplican los middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); //para leer queries y params
app.use(cookieParser(envs.CODE_SECRET)); //configuramos el cookieParser con el código "secret"
app.use(session({ // configuramos nuestro modulo session
    store: MongoStore.create({ // vinculamos al sesión con Mongo Atlas
        mongoUrl: urlDbMongo, // Utilizamos la misma URL de nuestro Mongo Atlas
        ttl: 15 // tiempo de conexión
    }),
    secret: envs.CODE_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); // middleware para inicializar Passport
app.use(passport.session()); // control de sesiones
initializePassport(); // inicializamos la función que contiene las estrategias
app.use(cors());

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs)); // middleware para mostrar la documentación de Swagger

//para configurar las rutas
app.use("/api", router);

app.use(errorHandler); // middleware para controlar errores

// para inicializar la app de express configuro el puerto
const port = envs.PORT; 
const ready = logger.info("Server ready on port " + port); //se define callback con mensaje de que el servidor se encuentra activo utilizando "logger"

//para inicializar el servidor
app.listen(port, ready);