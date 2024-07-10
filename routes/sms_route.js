import { Router } from "express";
import send_sms from "../controllers/sms.controller.js";

const router = Router();

router.post("/send", send_sms);

export default router;