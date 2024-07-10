import { Router } from "express";
import question from "../controllers/question_controller.js";

const question_router = Router()

question_router.post('/create', question)



export default question_router