import { usersModel } from "../models/users.model.js"; // importamos el usersModel para utilizar los modelos para interactuar con la base de datos

const getUsers = async () => { // creamos una función para traer todo
    const users = await usersModel.find(); // utilizamos el método paginate para traer los usuarios según parámetros y para obtener los datos de total de páginas, el número de página, etc.
    return users;
};

const getUserById = async (id) => {
	const user = usersModel.findById(id); // utilizamos el método findById para traer un elemento por id
    return user;
};

const getUserByEmail = async (email) => {
    const user = usersModel.findOne({email});
    return user;
}
const createUser = async (data) => {
	const user = usersModel.create(data); // utilizamos el método create para crear un usuario
    return user;
};

const updateUserById = async (id, data) => {
	
    const user = await usersModel.findByIdAndUpdate(id, data, {new: true}); // utilizamos el método findByIdAndUpdate para actualizar el elemento primero
    return user;
};


const deleteUserById = async (id) => {
	const user = await usersModel.deleteOne({_id: id}); // utilizamos el método deleteOne con un parámetro de búsqueda para eliminar el usuario con el id que coincida con la propiedad id del elemento
    if(user.deletedCount === 0) return false; // comprobamos si se efectuó la eliminación del usuario.
    return true; // sólo devolvemos un true porque no me interesa que me retorne el elemento eliminado
};

export default {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUserById,
    deleteUserById
}