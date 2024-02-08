import { Router } from "express";
import { sendEmail, sendSMS, sendSuccess, sendContact } from "../controllers/correos.controller.js";

const router = Router();
router.get("/sms", async (req, res, next) => {
  try {
    await sendSMS(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/email", async (req, res, next) => {
  try {
    await sendEmail(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/success", async (req, res, next) => {
  try {
    await sendSuccess(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/contact", async (req, res, next) => {
  try {
    await sendContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
