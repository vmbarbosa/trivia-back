import Joi from "joi"

const question_regex = Joi.object({
  difficulty: Joi.number().integer().min(1).max(3).required(),
  question: Joi.string().trim().required(),
  wrong_answer: Joi.array().items(Joi.string()).length(3).required(),
  correct_answer: Joi.string().trim().required()
})

const regex_upd_q = Joi.object({
  difficulty: Joi.number().integer().min(1).max(3),
  question: Joi.string().trim(),
  wrong_answer: Joi.array().items(Joi.string()).length(3),
  correct_answer: Joi.string().trim()
}).min(1)

export { 
  question_regex, 
  regex_upd_q
}