import { Router } from "express";
import { get_all_scores } from "../controllers/score.controller.js";

const router = Router();

router.get("/get-all", get_all_scores);

export default router;