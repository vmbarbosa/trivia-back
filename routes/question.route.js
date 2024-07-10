import { Router } from "express";
import { question, createAll } from '../controllers/question.controller.js';

const question_router = Router()

question_router.post('/create-all', createAll)

question_router.post('/create', question)

export default question_router