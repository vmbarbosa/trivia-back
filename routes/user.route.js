import { Router } from "express";
import { update, deleteUser } from "../controllers/user.controller.js";

const user_router = Router()

user_router.put('/update/:id', update)
user_router.delete('/delete/:id', deleteUser)

export default user_router