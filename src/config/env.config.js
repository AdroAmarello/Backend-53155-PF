import dotenv from "dotenv"; // importamos "dotenv" para configurar nuestras variables de entorno

const environment = "dev";
dotenv.config({
    path: environment === "PRODUCTION" ? "./.env.prod" : "./.env.dev" 
});


export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    CODE_SECRET: process.env.CODE_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS
}