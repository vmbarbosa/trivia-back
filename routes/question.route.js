import { Router } from "express";
import { get, create, create_all, update, result, delete_question } from '../controllers/question.controller.js';
import { valid_token, valid_token_or_next } from "../services/middleware/valid-token.js"

const question_router = Router();

question_router.get('/get', valid_token_or_next, get)

question_router.post('/create', valid_token, create)

question_router.post('/create-all', valid_token, create_all)

question_router.put('/update/:id', valid_token, update)

question_router.delete("/delete/:id", valid_token, delete_question);

question_router.post('/result/:id', valid_token_or_next, result)

export default question_router;
