import { Router } from "express";
import { test } from "../controllers/main.controller.js";
import auth_router from "./auth.route.js";
import { send_sms } from "../controllers/sms.controller.js";
import { valid_token } from "../services/middleware/valid-token.js";
import { get_user } from "../services/middleware/get-user.js";

const router = Router();

router.get("/test", test);

router.use("/auth", auth_router);

router.post("/send/sms", valid_token, get_user, send_sms);

//router.use('/question', valid_token, )

//router.use('/score', valid_token, )

export default router;
