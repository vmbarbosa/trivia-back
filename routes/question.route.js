import { Router } from "express";
import question from "../controllers/question.controller.js";
const question_router = Router()

question_router.get('/get', question)

export default question_router