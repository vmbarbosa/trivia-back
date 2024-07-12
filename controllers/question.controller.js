import { constants } from "../services/utils/constants.js";

import { 
  create as create_question,
  create_all as create_question_all,
  update as update_question,
  get as get_question,
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

const delete_question_by_id = async (req, res) => {
  const userDeleted = await delete_question(req);
  res.status(status.OK).json(userDeleted);
}

const update = async (req, res) => {
  const question_db = await update_question(req.params.id, req.body);
  res.status(status.OK).json(question_db);
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
  result,
  delete_question_by_id
}
