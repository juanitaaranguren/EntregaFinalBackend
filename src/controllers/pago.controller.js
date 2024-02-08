import { paymentService, cartService } from "../services/index.js";
import { handleError } from "../utils.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const session = await paymentService.createCheckoutSession(cart.products, cid);
    return res.json(session);
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    return handleError("Error al crear la sesión de pago", res);
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const cid = req.params.cid;
    const { email } = req.user.user;

    const newTicket = await paymentService.paymentSuccess(cid, email);

    if (!newTicket) {
      return res.status(404).send("error en el pago");
    }

    console.log(newTicket);
    res.render("success", newTicket);
  } catch (error) {
    console.error("Error en el pago:", error);
    return handleError("error en el pago", res);
  }
};

export const paymentCancel = async (req, res) => {
  res.send("cancel");
};
