import ticketsRepository from "../persistences/mongo/repositories/tickets.repository.js";

const createTicket = async (userEmail, totalCart) => { // tomamos por parámetro el email del usuario y el total del carrito
    const newTicket = {
        amount: totalCart,
        purchaser: userEmail,
        code: Math.random().toString(36).substr(2, 9), // creamos un código único para el ticket
    };

    return await ticketsRepository.createTicket(newTicket);
};

export default {
    createTicket,
}