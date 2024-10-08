// Creamos configuración de estrategias de Passport (generador de estrategias de autenticación)
import passport from "passport";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import local from "passport-local";
import envs from "../config/env.config.js";
import usersRepository from "../persistences/mongo/repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import cartsRepository from "../persistences/mongo/repositories/carts.repository.js";
import { logger } from "../utils/logger.js";

const LocalStrategy = local.Strategy // designamos la estrategia de passport-local
const GoogleStrategy = google.Strategy; // designamos la estrategia de google
const JWTStrategy = jwt.Strategy; // designamos la estrategia de jwt
const ExtractJWT = jwt.ExtractJwt; // designamos la estrategia de extracción del token sin importar de qué req venga

const cookieExtractor = (req) => { // como nosotros necesitamos extraer el token de una cookie creamos esta función
    let token = null; // inicializamos en null 

    if (req && req.cookies) { // verificamos si existe una req y si existe una req.cookies
        token = req.cookies.token; // asignamos a "token" lo que obtenemos de la cookie 
    }

    return token;
};

// Lógica para inicializar todas las estrategias que configuremos
const initializePassport =() => {
    // utilizamos middleware de passport
    passport.use( // le damos un nombre a la estrategia con un string y luego creamos una nueva instancia de LocalStrategy con un objeto de configuración 
        "register",
        new LocalStrategy ({passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                try {
                    
                    const { firstName, lastName, email, age, role } = req.body; // tomamos la data del user desde el body

                    const user = await usersRepository.getUserByEmail(username); // buscamos por email el usuario
                    if (user) return done(null, false, {message: "El usuario ya existe"}) // si existe nos informa que ya existe y en el segundo parámetro establecemos el valor en false para que no cree un nuevo usuario


                    const cart = await cartsRepository.createCart(); // creamos un cart para que se asocie a nuestro usuario

                    //si no existe el usuario 
                    const newUser = { // creamos un objeto para controlar la información que recibimos
                        firstName,
                        lastName,
                        email,
                        age,
                        password: createHash(password), // aquí invocamos a la función de Encriptar contraseña y le pasamos al contraseña del body
                        role,
                        cart: cart._id // vinculamos el id del cart creado con nuestro user
                    }

                    const createUser= await usersRepository.createUser(newUser); // se utilizan los datos de "newUser" para crear un nuevo usuario
                    return done(null, createUser) // en el segundo parámetro se pasa el "createUser"

                } catch (error) {
                    return done(error);
                    
                }
            } // factorizamos la información del usuario para quitarle responsabilidad a las rutas y le pasamos a Passport toda esta información para que la maneje de manera global en nuestro proyecto
        ));

    passport.use( // se crea la estrategia para el login, no hace falta permitirle a Passport acceder al objeto "request", sólo asignamos el "email" como "usernameField"
        "login",
        new LocalStrategy({ usernameField: "email"},
        async (username, password, done) =>{
            try {
                
                const user = await usersRepository.getUserByEmail(username); // buscamos por email el usuario
                if(!user || !isValidPassword(user, password)) return done(null, false, {message: "Email o password no válidos"});
                // Si los datos son válidos
                return done(null, user);

            } catch (error) {
                done(error)
                
            }
        })
    );

    passport.use( // se crea la estrategia para autenticarse con google
        "google",
        new GoogleStrategy(
            {
                clientID: envs.GOOGLE_CLIENT_ID, // ID proporcionado por google
                clientSecret:envs.GOOGLE_CLIENT_SECRET, // Clave proporcionada por google
                callbackURL: "http://localhost:8080/api/sessions/google" // URL de nuestro endpoint donde se conectará esta estrategia
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    
                    const { name, emails } = profile; // Desestructuramos los elementos que nos entrega google
                    const user = { // Aquí asignamos al objeto "user" los datos que nos brinda google
                        firstName: name.givenName,
                        lastName: name.familyName,
                        email: emails[0].value
                    };

                    const existUser = await usersRepository.getUserByEmail(emails[0].value)
                    if (existUser) return cb(null,existUser); // en caso de que exista el usuario le damos a Passport la información para que acceda a la sesión

                    const newUser = await usersRepository.createUser(user); // en caso de que no exista crea el usuario con la información que nos brindó google
                    cb(null, newUser) // pasamos el "newUser" para que Passport serialize y deserialize esa información 


                } catch (error) {
                    return cb(error);
                }
            }
        )
    );

    passport.use( // se crea la estrategia de JWT
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), // utilizamos la función "cookieExtractor" para extraer el token de la cookies
                secretOrKey: envs.CODE_SECRET,
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
    ));

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => { // pasamos el usuario y en done pasamos el id del usuario
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => { // pasamos una función asíncrona con dos parámetros, un id para buscar al usuario y pasarlo en la función de callback "done"
        const user =await usersRepository.getUserById(id);
        done(null, user);
    })
}

export default initializePassport;