import { Router } from "express";
import update from "../controllers/user.controller.js";

const user_router = Router()

user_router.put('/update/:user_id', update)


export default user_router