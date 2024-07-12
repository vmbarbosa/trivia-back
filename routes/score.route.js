import { Router } from "express";
import { get_all_scores, reset_score } from "../controllers/score.controller.js";
import { valid_token } from "../services/middleware/valid-token.js";

const score_router = Router();

score_router.get("/get-all", get_all_scores);
score_router.patch('/reset', valid_token, reset_score);

export default score_router;
