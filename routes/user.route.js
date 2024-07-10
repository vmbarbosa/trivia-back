import { Router } from "express";
import update from "../controllers/user.controller.js";
import { valid_token } from '../services/middleware/valid-token.js'

const user_router = Router()

user_router.put('/update/:user_id', valid_token, update)

export default user_router