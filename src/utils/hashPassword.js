//Aquí estará la lógica de la librería para hashear las contraseñas
import bcrypt from 'bcrypt';

// Encriptar contraseña

export const createHash = (password) => { // pasamos por parámetro el password y con "genSaltSync" y el número de las iteraciones para el hashing
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar contraseña

export const isValidPassword = (user, password) => { // Desencripta la contraseña, la compara y retorna un boolean
    return bcrypt.compareSync(password, user.password) // el "password" es el que le pasamos por body y compara con el "user.password" de la base de datos
};