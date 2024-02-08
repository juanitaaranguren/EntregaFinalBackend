import { Router } from "express";
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/products.controller.js";
import { 
  authorizeJWT, 
  authorizeRole, 
  authorizeProductAccess 
} from "../utils.js";

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    const products = await getAllProducts(req.query.limit);
    res.status(200).json({ status: "Success", products });
  } catch (error) {
    next(error);
  }
});

router.post("/products", authorizeJWT(), authorizeRole(["Premium", "Admin"]), async (req, res, next) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json({ status: "Success", product: newProduct });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:pid", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.pid);
    res.status(200).json({ status: "Success", product });
  } catch (error) {
    next(error);
  }
});

router.put("/products/:pid", authorizeJWT(), authorizeRole("Admin"), async (req, res, next) => {
  try {
    const updatedProduct = await updateProduct(req.params.pid, req.body);
    res.status(200).json({ status: "Success", product: updatedProduct });
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:pid", authorizeJWT(), authorizeRole(["Premium", "Admin"]), authorizeProductAccess, async (req, res, next) => {
  try {
    await deleteProduct(req.params.pid);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
