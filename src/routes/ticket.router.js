import { Router } from "express";
import { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket 
} from "../controllers/ticket.controller.js";
import { 
  authorizeJWT, 
  authorizeRole 
} from "../utils.js";

const router = Router();
router.post("/tickets", authorizeJWT(), async (req, res, next) => {
  try {
    const newTicket = await createTicket(req.body);
    res.status(201).json({ status: "Success", ticket: newTicket });
  } catch (error) {
    next(error);
  }
});

router.get("/tickets", authorizeJWT(), async (req, res, next) => {
  try {
    const tickets = await getTickets();
    res.status(200).json({ status: "éxito", tickets });
  } catch (error) {
    next(error);
  }
});

router.get("/tickets/:id", authorizeJWT(), async (req, res, next) => {
  try {
    const ticket = await getTicketById(req.params.id);
    res.status(200).json({ status: "éxito", ticket });
  } catch (error) {
    next(error);
  }
});

router.put("/tickets/:id", authorizeJWT(), authorizeRole("Admin"), async (req, res, next) => {
  try {
    const updatedTicket = await updateTicket(req.params.id, req.body);
    res.status(200).json({ status: "éxito", ticket: updatedTicket });
  } catch (error) {
    next(error);
  }
});

router.delete("/tickets/:id", authorizeJWT(), authorizeRole("Admin"), async (req, res, next) => {
  try {
    await deleteTicket(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
