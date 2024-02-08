import { Router } from "express";
import { generateProducts } from "../utils.js";
const router = Router();
router.get("/simulador-productos", async (req, res) => {
  try {
    const productos = [];
    for (let index = 0; index < 100; index++) {
      productos.push(generateProducts());
    }
    res.status(200).json({ status: "Éxito", productos: productos });
  } catch (error) {
    res.status(500).json({ status: "Error", mensaje: "No se pudieron simular los productos" });
  }
});

export default router;
