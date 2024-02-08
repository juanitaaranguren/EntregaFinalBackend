import { TicketDAO } from "../daos/ticket.daos.js";

class TicketService {
  constructor() {}

  async getAllTickets() {
    try {
      return await TicketDAO.getAll();
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async getTicketById(ticketId) {
    try {
      return await TicketDAO.getById(ticketId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async createTicket(ticketData) {
    try {
      return await TicketDAO.create(ticketData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async updateTicketById(ticketId, newData) {
    try {
      return await TicketDAO.updateById(ticketId, newData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async deleteTicketById(ticketId) {
    try {
      return await TicketDAO.deleteById(ticketId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

export default new TicketService();
