import { cartService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    req.logger.error("No se pudo crear el carrito", error);
    handleError(config.cart_not_add, res);
  }
};

export const getCarts = async (req, res) => {
  const limit = req.query.limit;
  try {
    const carts = await cartService.getCarts(limit);
    res.status(200).json({ message: "Carritos obtenidos exitosamente", payload: carts });
  } catch (error) {
    req.logger.error("No se pudo obtener los carritos", error);
    handleError(config.cart_not_found, res);
  }
};

export const getCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartService.getCartById(cid);
    res.status(200).json({ message: "Carrito obtenido exitosamente", payload: cart });
  } catch (error) {
    req.logger.error("No se pudo obtener el carrito", error);
    handleError(config.cart_not_found, res);
  }
};

export const addProductCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.query.quantity || 1;

  try {
    const result = await cartService.addProductCart(cid, pid, quantity);
    if (result) {
      res.status(200).json({ status: "Producto agregado al carrito", payload: result });
    } else {
      handleError(config.cart_not_found, res);
    }
  } catch (error) {
    req.logger.error("No se pudo agregar el producto al carrito", error);
    handleError(config.cart_not_add_product, res);
  }
};

export const deleteProductCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const result = await cartService.deleteProductCart(cid, pid);
    if (result) {
      res.status(200).json({ status: "Producto eliminado del carrito", payload: result });
    } else {
      handleError(config.cart_not_found, res);
    }
  } catch (error) {
    req.logger.error("No se pudo eliminar el producto del carrito", error);
    handleError(config.cart_not_delete_product, res);
  }
};

export const deleteCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await cartService.deleteCartById(cid);
    res.status(200).json({ message: "Carrito eliminado exitosamente", payload: result });
  } catch (error) {
    req.logger.error("No se pudo eliminar el carrito", error);
    handleError(config.cart_not_delete, res);
  }
};

export const finishPurchase = async (req, res) => {
  const cid = req.params.cid;

  try {
    const result = await cartService.finishPurchase(cid);
    res.status(200).json({ status: "Compra realizada con éxito", payload: result });
  } catch (error) {
    req.logger.error("No se pudo realizar la compra", error);
    handleError(config.cart_not_purchase, res);
  }
};
