import TicketModel from "./models/ticketModel.js";

export default class Ticket {
  async createTicket(ticketData) {
    const currentDateTime = new Date().toLocaleString();
    const ticket = {
      ...ticketData,
      purchase_datetime: currentDateTime,
    };
    return TicketModel.create(ticket);
  }

  async getTickets(limit) {
    const tickets = await TicketModel.find().limit(limit);
    return tickets;
  }

  async getTicketById(id) {
    return TicketModel.findById(id);
  }

  async updateTicketById(id, updatedTicket) {
    return TicketModel.findByIdAndUpdate(id, updatedTicket);
  }

  async deleteTicket(id) {
    return TicketModel.findByIdAndDelete(id);
  }
}
