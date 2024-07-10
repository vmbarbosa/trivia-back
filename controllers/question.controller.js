import { constants } from "../services/utils/constants.js";
import {
  create as create_question,
  create_all as create_question_all,
  delete_question_by_id as delete_question,
} from "../services/question.service.js";

const { status } = constants.response;

const create = async (req, res) => {
  const question_db = await create_question(req.body);
  res.status(status.OK).json(question_db);
};

const create_all = async (req, res) => {
  const questionDB = await create_question_all(req.body);
  res.status(status.OK).json(questionDB);
};
const delete_question_by_id = async (req, res) => {
  const userDeleted = await delete_question(req);
  res.status(status.OK).json(userDeleted);
};
export { create, create_all, delete_question_by_id };
