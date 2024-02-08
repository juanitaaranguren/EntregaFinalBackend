import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import ProductModel from "../Dao/mongoManager/models/productModel.js";
import { authorizationRol, authorizationStrategy } from "../utils.js";

const router = Router();

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.redirect("/login");
}

function isNotAuthenticated(req, res, next) {
  if (!req.user) {
    return next();
  }
  return res.redirect("/");
}

async function isResetTokenExpired(req, res, next) {
  const token = req.query.token;
  try {
    const decoded = jwt.verify(token, config.secret_jwt);
    if (Date.now() > decoded.exp * 1000) {
      return res.render("resetPassError", { message: "El enlace ha expirado" });
    }
    return next();
  } catch (error) {
    return res.render("resetPassError", { message: "Error al verificar el enlace" });
  }
}

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", {});
});

router.get("/resetPass", isNotAuthenticated, (req, res) => {
  res.render("resetPass", {});
});

router.get("/resetPassError", isNotAuthenticated, (req, res) => {
  res.render("resetPassError", {});
});

router.get("/resetPassConfirm", isNotAuthenticated, isResetTokenExpired, (req, res) => {
  res.render("resetPassConfirm", { token: req.query.token });
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", {});
});

router.get("/profile", isAuthenticated, (req, res) => {
  const user = req.user;
  res.render("profile", user);
});

router.get("/admin", authorizationStrategy("jwt", { session: false }), authorizationRol(["Premium", "Admin"]), (req, res) => {
  res.render("admin", {});
});

router.get("/login-github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/messages", authorizationStrategy("jwt", { session: false }), authorizationRol("Usuario"), (req, res) => {
  res.render("messages", {});
});

router.get("/cart", authorizationStrategy("jwt", { session: false }), authorizationRol(["Usuario", "Premium"]), (req, res) => {
  res.render("cart", {});
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 10);
  const queryParams = req.query?.query || "";
  const query = {};
  if (queryParams) {
    const [field, value] = queryParams.split(",");
    if (!isNaN(parseInt(value))) {
      query[field] = value;
    }
  }
  const sortField = req.query?.sortField || "createdAt";
  const sortOrder = req.query?.sortOrder === "desc" ? -1 : 1;
  try {
    const products = await ProductModel.paginate(query, {
      limit,
      page,
      lean: true,
      sort: { [sortField]: sortOrder },
    });
    products.prevLink = products.hasPrevPage
      ? `/productos?page=${products.prevPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/productos?page=${products.nextPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    res.render("home", { products });
  } catch (error) {
    res.status(500).send("Error al obtener productos.");
  }
});

router.get("/contacto", async (req, res) => {
  res.render("contacto", {});
});

export default router;
