import { Router } from "express";
import { create, create_all, update, question } from '../controllers/question.controller.js';
import {valid_token, valid_token_get_question} from "../services/middleware/valid-token.js"

const question_router = Router()

question_router.get('/get', valid_token_get_question, question)

question_router.post('/create', valid_token, create)

question_router.post('/create-all', valid_token, create_all)

question_router.put('/update/:id', valid_token, update)

export default question_router