import { productService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await productService.getProducts(limit);

    if (!result) {
      return res.status(404).json({ error: "No se encontraron productos" });
    }

    return res.send({ status: "Success", payload: result });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    req.logger.error("No se pudo obtener los productos");
    return handleError(config.product_not_found, res);
  }
};

export const addProducts = async (req, res) => {
  const data = req.body;
  const { email } = req.user.user;
  data.owner = email;

  try {
    const result = await productService.addProducts(data);

    if (!result) {
      return res.status(500).json({ error: "Error al agregar el producto" });
    }

    return res.status(201).json({ message: "Producto agregado exitosamente", payload: result });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    req.logger.error("No se pudo agregar el producto");
    return handleError(config.product_not_add, res);
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;

  try {
    const result = await productService.getProductById(id);

    if (!result) {
      req.logger.warning("No se encontró el producto");
      return res.status(404).json({ error: "No se encontró el producto" });
    }

    return res.send({ status: "Producto encontrado", payload: result });
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    req.logger.error("No se pudo obtener el producto");
    return handleError(config.product_not_found, res);
  }
};

export const updatedProductById = async (req, res) => {
  const productId = req.params.pid;
  const { code, title, description, stock, price, thumbnail, category, owner } = req.body;
  const updatedProduct = { code, title, description, stock, price, thumbnail, category, owner };

  try {
    const result = await productService.updatedProductById(productId, updatedProduct);

    if (!result) {
      return res.status(404).json({ error: "No se pudo actualizar el producto" });
    }

    return res.send({ status: "Producto actualizado exitosamente", payload: result });
  } catch (error) {
    console.error("Error al actualizar el producto por ID:", error);
    req.logger.error("No se pudo actualizar el producto");
    return handleError(config.product_not_update, res);
  }
};

export const deletedProduct = async (req, res) => {
  const productId = req.params.pid;

  try {
    const result = await productService.deleteProduct(productId);

    if (!result) {
      req.logger.warning("No se pudo eliminar el producto");
      return res.status(404).json({ error: "No se pudo eliminar el producto" });
    }

    return res.send({ status: "Producto eliminado exitosamente", payload: result });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    req.logger.error("Error al eliminar el producto");
    return handleError(config.product_not_delete, res);
  }
};
