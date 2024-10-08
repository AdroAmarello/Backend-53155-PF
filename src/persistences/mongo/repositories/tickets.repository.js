import { ticketModel } from "../models/tickets.model.js";

const createTicket = async (data) => {
    return await ticketModel.create(data);
};

export default {
    createTicket,
};