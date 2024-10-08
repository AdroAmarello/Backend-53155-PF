import customErrors from "../errors/customErrors.js";
import usersServices from "../services/users.services.js";
import { logger } from "../utils/logger.js";

const sendEmailResetPassword = async (req, res, next) => {
    try {

        const { email }= req.body;

        res.cookie("resetPassword", email, { httpOnly: true, maxAge: 10000 });

        const response = await usersServices.sendEmailResetPassword(email);
        res.status(200).json({ status: "success", response });
        
    } catch (error) {
        error.path = "[POST] /api/users/email/reset-password"; // Se agrega una propiedad "path" al objeto "error" para que cuando se produzca algún inconveniente en el log figure en qué ruta ocurrió
        next(error);
    }
};

const resetPassword = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const emailCookie= req.cookies.resetPassword;
        if (!emailCookie) throw customErrors.badRequestError("Email link expired");

        await usersServices.resetPassword(email, password);

        res.status(200).json({ status: "success", response: "Password updated" });
        
    } catch (error) {
        error.path = "[POST] /api/users/reset-password";
        next(error);
    }
};

const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const response = await usersServices.changeUserRole(uid);
        res.status(200).json({ status: "success", response });
    } catch (error) {
        error.path = "[GET] /api/users/premium/:uid";
        next(error);
    }
};  

const addDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const files = req.files;
        const response = await usersServices.addDocuments(uid, files);
        res.status(200).json({ status: "success" , response});
    } catch (error) {   
        logger.error(error);     
        error.path = "[POST] /api/users/:uid/documents";
        next(error);
        
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await usersServices.getUsers();
        res.status(200).json({ status: "success", users });
    } catch (error) {
        error.path = "[GET] /api/users";
        next(error);
    }
}

export default { sendEmailResetPassword, resetPassword, changeUserRole, addDocuments, getUsers };