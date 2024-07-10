import { constants } from "../services/utils/constants.js";
import {
  create as create_question,
  create_all as create_question_all,
  update_question,
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
const update = async (req, res, next) => {
  const update_q = await update_question(req, res, next);
  res.status(status.OK).json(update_q);
};

const delete_question_by_id = async (req, res) => {
  const userDeleted = await delete_question(req);
  res.status(status.OK).json(userDeleted);
};
export { create, create_all, update, delete_question_by_id };
