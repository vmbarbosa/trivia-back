import { Router } from "express";
import { resetscore, get_all_scores } from "../controllers/score.controller.js";

const score_router = Router();

score_router.patch('/reset', resetscore);
score_router.get("/get-all", get_all_scores);

export default score_router;
