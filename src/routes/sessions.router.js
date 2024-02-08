import { Router } from "express";
import passport from "passport";
import {
  authorizeRole,
  authorizeJWT,
  extractNonSensitiveUserInfo
} from "../utils.js";
import {
  handleLocalRegister,
  handleLocalLogin,
  handleGithubLogin,
  handleLogout,
  handleResetPassword
} from "../controllers/sessions.controller.js";

const router = Router();
router.post("/register", passport.authenticate("register", { failureRedirect: "/register" }), handleLocalRegister);
router.post("/login", passport.authenticate("login", { failureRedirect: "/login" }), handleLocalLogin);

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), handleGithubLogin);

router.get("/logout", handleLogout);
router.post("/reset-password", handleResetPassword);
router.get("/current-user", authorizeJWT(), authorizeRole(["Usuario", "Admin", "Premium"]), extractNonSensitiveUserInfo, (req, res) => {
  if (req.nonSensitiveUserInfo) {
    res.status(200).json({ status: "success", payload: req.nonSensitiveUserInfo });
  } else {
    res.status(401).json({ error: "No autorizado" });
  }
});

export default router;
