import { Router } from "express";
import { create, create_all } from '../controllers/question.controller.js';

const question_router = Router()

question_router.post('/create', create)

question_router.post('/create-all', create_all)

export default question_router