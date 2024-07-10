import { constants } from "../services/utils/constants.js";
import { create as create_question, create_all as create_question_all } from "../services/question.service.js";

const { status } = constants.response;

const create = async (req, res) => {
  const question_db = await create_question(req.body)
  res.status(status.OK).json(question_db)
}

const create_all = async (req, res) => {
  const questionDB = await create_question_all(req.body);
  res.status(status.OK).json(questionDB);
};

export { 
  create,
  create_all 
}