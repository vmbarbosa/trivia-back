import { Router } from "express";
import { create, create_all, update } from '../controllers/question.controller.js';

const question_router = Router()

question_router.post('/create', create)

question_router.post('/create-all', create_all)

question_router.put('/update/:id', update)

export default question_router