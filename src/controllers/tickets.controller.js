import { ticketService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      amount: req.body.amount,
      purchaser: req.nonSensitiveUserInfo
        ? req.nonSensitiveUserInfo.email
        : req.body.purchaser,
    };

    const newTicket = await ticketService.createTicket(ticketData);

    res.status(201).json({ status: "success", payload: newTicket });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    req.logger.error("No se pudo crear el ticket");
    handleError(config.ticket_not_add, res);
  }
};

export const getTickets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const tickets = await ticketService.getTickets(limit);

    res.json({ status: "success", payload: tickets });
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    req.logger.error("Error al obtener tickets");
    handleError(config.ticket_not_found, res);
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ status: "success", payload: ticket });
  } catch (error) {
    console.error("Error al obtener ticket por id:", error);
    req.logger.error("Error al obtener ticket por id");
    handleError(config.ticket_not_found, res);
  }
};

export const updateTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updatedTicketData = req.body;

    const updatedTicket = await ticketService.updateTicketById(
      ticketId,
      updatedTicketData
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ status: "success", payload: updatedTicket });
  } catch (error) {
    console.error("Error al actualizar ticket:", error);
    req.logger.error("Error al actualizar ticket");
    handleError(config.ticket_not_update, res);
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await ticketService.deleteTicket(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.json({ status: "success", payload: deletedTicket });
  } catch (error) {
    console.error("Error al eliminar ticket:", error);
    req.logger.error("Error al eliminar ticket");
    handleError(config.ticket_not_delete, res);
  }
};
