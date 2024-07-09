import { Router } from "express";
import { createAll } from '../controllers/question.controller.js';

const question_router = Router()

question_router.post('/create-all', createAll)




export default question_router