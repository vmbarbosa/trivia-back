import { Router } from "express";
import { resetscore } from "../controllers/score.controller.js";

const score_router = Router()

score_router.patch('/reset', resetscore)


export default score_router