import { Router } from "express";
import {
  addProductCart,
  createCart,
  deleteCartById,
  deleteProductCart,
  finishPurchase,
  getCartById,
  getCarts,
} from "../controllers/cart.controller.js";
import {
  authorizationAddToCart,
  authorizationRol,
  authorizationStrategy,
} from "../utils.js";

const router = Router();
router.post("/carts", createCart);
router.get("/carts", getCarts);
router.get("/carts/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      throw new Error("ID no definido");
    }
    const cart = await getCartById(cid);
    if (!cart) {
      throw new Error("no se encontró el carrito");
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
});
router.post(
  "/carts/:cid/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  authorizationAddToCart,
  async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      if (!cid || !pid) {
        throw new Error("ID de carrito o producto no definido");
      }
      await addProductCart(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/carts/:cid/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      if (!cid || !pid) {
        throw new Error("ID de carrito o producto no definido");
      }
      await deleteProductCart(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/carts/:cid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      if (!cid) {
        throw new Error("ID de carrito no definido");
      }
      await deleteCartById(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/carts/purchase/buy/:cid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "usuarioPremium"]),
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      if (!cid) {
        throw new Error("");
      }
      await finishPurchase(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
