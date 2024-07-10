import { Router } from "express";
import send_sms from "../controllers/sms.controller";

const router = Router();

router.post("/send", send_sms);

export default router;