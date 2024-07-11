import { constants } from "../services/utils/constants.js";
import { 
  create as create_question,
  create_all as create_question_all,
  update as update_question,
  get as get_question,
  check_answer, save_score, return_answer_validation
} from "../services/question.service.js";

const { status } = constants.response;

const get = async (req, res) => {
  const question_db = await get_question(req.user)
  res.status(status.OK).json(question_db)
}

const create = async (req, res) => {
  const question_db = await create_question(req.body)
  res.status(status.OK).json(question_db)
}

const create_all = async (req, res) => {
  const question_db = await create_question_all(req.body);
  res.status(status.OK).json(question_db);
};

const update = async (req, res) => {
  const question_db = await update_question(req.params.id, req.body);
  res.status(status.OK).json(question_db);
}

const result = async (req, res) => {
  const validation = await check_answer(req, res)
  if (req.isAuth && req.body.user_id) {
    await save_score(req, res, validation.result, validation.question)
  }
  await return_answer_validation(req, res, validation.result)
}

export { 
  get,
  create,
  create_all,
  update,
  result
}
