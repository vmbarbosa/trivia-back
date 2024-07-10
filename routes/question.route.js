import { Router } from "express";
import {
  create,
  create_all,
  update,
  delete_question_by_id,
} from "../controllers/question.controller.js";

const question_router = Router();

question_router.post("/create", create);

question_router.post("/create-all", create_all);

question_router.put("/update/:id", update);

question_router.delete("/delete/:id", delete_question_by_id);

export default question_router;
