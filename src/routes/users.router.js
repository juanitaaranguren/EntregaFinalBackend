import { Router } from "express";
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from "../controllers/user.controller.js";
import { 
  authorizeJWT, 
  authorizeRole 
} from "../utils.js";

const router = Router();

router.post("/users", authorizeJWT(), async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json({ status: "éxito", user: newUser });
  } catch (error) {
    next(error);
  }
});

router.get("/users", authorizeJWT(), authorizeRole("Admin"), async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json({ status: "éxito", users });
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", authorizeJWT(), async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ status: "éxito", user });
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", authorizeJWT(), async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json({ status: "éxito", user: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", authorizeJWT(), authorizeRole("Admin"), async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
