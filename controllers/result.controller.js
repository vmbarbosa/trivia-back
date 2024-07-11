import { check_answer, save_score, return_answer_validation } from '../services/result.service.js'

const result = async (req, res) => {
  const validation = await check_answer(req, res)
  if (req.isAuth && req.body.user_id) {
    await save_score(req, res, validation.result, validation.question)
  }
  await return_answer_validation(req, res, validation.result)
}

export { result };