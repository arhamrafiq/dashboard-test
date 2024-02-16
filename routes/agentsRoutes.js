import express from "express";
import {
  customerRegistryController,
  paidAgendBasedController,
  sendMailController,
  upaidAgendBasedController,
} from "../controllers/customerController.js";
import { agentAuth } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", agentAuth, (req, res) => {
  res.send({
    ok: true,
  });
});
router.post("/add", agentAuth, customerRegistryController);
router.get("/mail/:id", agentAuth, sendMailController);
router.get("/get-unpaid/:aid", agentAuth, upaidAgendBasedController);
router.get("/get-paid/:aid", agentAuth, paidAgendBasedController);

export default router;
