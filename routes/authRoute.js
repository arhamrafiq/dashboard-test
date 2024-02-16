import express from "express";
import {
  LoginController,
  getAllPaid,
  registerController,
} from "../controllers/authcontrollers.js";
import { agentAuth } from "../middleware/authmiddleware.js";
import {
  paymentCancel,
  paymentSuccesfull,
  paymentscontroller,
} from "../controllers/customerController.js";

const router = express.Router();

// Registering
router.post("/register", registerController);
router.post("/login", LoginController);
router.get("/get-paid", getAllPaid);
router.post("/payment/start", paymentscontroller);
router.get("/payment/cancel", paymentCancel);
router.get("/payment/success/:oid", paymentSuccesfull);

export default router;
