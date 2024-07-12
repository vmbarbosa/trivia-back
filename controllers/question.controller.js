import { constants } from "../services/utils/constants.js";

import { 
  create as create_question,
  create_all as create_question_all,
  update as update_question,
  get as get_question,
  delete_question as delete_question_service,
  check_answer
} from "../services/question.service.js";

const { status } = constants.response;

const get = async (req, res) => {
  const question_db = await get_question(req.user)
  res.status(status.OK).json(question_db)
}

const create = async (req, res) => {
  const question_db = await create_question(req.body);
  res.status(status.OK).json(question_db);
};

const create_all = async (req, res) => {
  const question_db = await create_question_all(req.body);
  res.status(status.OK).json(question_db);
};

const update = async (req, res) => {
  const question_db = await update_question(req.params.id, req.body);
  res.status(status.OK).json(question_db);
}

const delete_question = async (req, res) => {
  const deleted = await delete_question_service(req.params.id);
  res.status(status.OK).json(deleted);
}

const result = async (req, res) => {
  const result = await check_answer(req.params.id, req.body)
  res.status(status.OK).json(result);
}

export { 
  get,
  create,
  create_all,
  update,
  delete_question,
  result
}
