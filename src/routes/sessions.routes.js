import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import { authorization, passportCall } from "../middlewares/passport.middlewares.js";
import { sendMail } from "../utils/sendMails.js";


const router = Router();

router.post("/register", passportCall("register"), sessionsController.userRegister); // endpoint de registro con middleware de passport y el nombre de la estrategia
router.post("/login", passportCall("login"), sessionsController.userLoginJWT); // endpoint de login con middleware de passport y el nombre de la estrategia
router.get("/google", passportCall("google", {
	scope: ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],
	session: false,
	}), sessionsController.userLoginGoogle); // endpoint de google)
router.get("/current", passportCall("jwt"), authorization("user"), sessionsController.userCurrent); // endpoint para comprobar el token mediante la estrategia de "jwt"
router.get("/logout", sessionsController.userLogout); // endpoint de logout

//TODO mover endpoint de email
// ! Endpoint No funciona nodemailer tira error

//!ERROR: Missing credentials for "PLAIN"

// router.get("/email", async (req,res) => {

// 	await sendMail("adroamarello@gmail.com", "Test Mailing nodemailer", "Este es un mensaje de prueba");
// 	return res.status(200).json({status: "success", msg: "Email enviado"});
// });

export default router;