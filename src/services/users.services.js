import error from "../errors/customErrors.js";
import usersRepository from "../persistences/mongo/repositories/users.repository.js";
import { usersResponseDto } from "../dto/user-response.dto.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { sendMail } from "../utils/sendMails.js";


const sendEmailResetPassword = async (email) => {
    const message = "Debe restablecer su password en el siguiente link https://www.google.com"; // colocar la ruta de la vista donde se restablecerá el password
    await sendMail(email, "Restablecer password", message);

    return "Email enviado";
};

const resetPassword = async (email, password) => {
    const user = await usersRepository.getUserByEmail(email);
    if (!user) throw error.notFoundError("User not found");

    const passwordIsEqual = isValidPassword(user, password);
    
    if (passwordIsEqual) throw error.badRequestError("Password already exists");

    return await usersRepository.updateUserById(user._id, { password: createHash(password) });

};

const changeUserRole = async (uid) => {
    const user = await usersRepository.getUserById(uid);
    if (!user) throw error.notFoundError("User not found");

    //validación de que el usuario tenga al menos 3 documentos para poder pasar de user a premium
    if (user.role === "user" && user.documents.length < 3) throw error.badRequestError("User must have at least 3 documents");

    const userRole = user.role === "premium" ? "user" : "premium";

    return await usersRepository.updateUserById(uid, { role: userRole });
};

const addDocuments = async (uid, reqFiles) => {
    
    const files = reqFiles.document;
    const userDocuments = files.map((file) => {
        return {
            name: file.filename,
            reference: file.path,
        };
    });

    const user = await usersRepository.updateUserById(uid, { documents: userDocuments });
    
    return user;
};

const getUsers = async () => {
    const usersDto = await usersRepository.getUsers();
    return usersDto.map(usersResponseDto);
    
};

export default { sendEmailResetPassword, resetPassword, changeUserRole, addDocuments, getUsers };