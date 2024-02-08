import { Router } from "express";
import { processPayment, verifyPayment } from "../controllers/pagos.controller.js";
import { authorizationStrategy, authorizationRol } from "../utils.js";

const router = Router();
router.post(
  "/process",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  async (req, res, next) => {
    try {
      await processPayment(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/verify/:paymentId",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  async (req, res, next) => {
    try {
      await verifyPayment(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
