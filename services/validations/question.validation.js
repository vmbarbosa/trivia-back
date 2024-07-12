import Joi from "joi"
import { objectId_validator } from "../utils/utils.js"

const question_regex = Joi.object({
  difficulty: Joi.number().integer().min(1).max(3).required(),
  question: Joi.string().trim().required(),
  wrong_answer: Joi.array().items(Joi.string()).length(3).required(),
  correct_answer: Joi.string().trim().required()
})

const question_update_regex = Joi.object({
  difficulty: Joi.number().integer().min(1).max(3),
  question: Joi.string().trim(),
  wrong_answer: Joi.array().items(Joi.string()).length(3),
  correct_answer: Joi.string().trim()
}).min(1)

const question_result_regex = Joi.object({
  user_id: Joi.string().custom(objectId_validator),
  answer: Joi.string().trim().required()
})

export { 
  question_regex, 
  question_update_regex,
  question_result_regex
}