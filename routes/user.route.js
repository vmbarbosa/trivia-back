import { Router } from "express";
import { update, delete_user } from "../controllers/user.controller.js";

const user_router = Router()

user_router.put('/update/:id', update)

user_router.delete('/delete/:id', delete_user)

export default user_router