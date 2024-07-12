import Joi from "joi"
import { objectId_validator } from "../utils/utils.js"

const score_regex = Joi.object({
  user_id: Joi.string().custom(objectId_validator).required(),
  score: Joi.number().integer().min(0).required(),
  id_correct_answers: Joi.string().custom(objectId_validator),
  id_wrong_answers: Joi.string().custom(objectId_validator)
})
  .xor('id_correct_answers', 'id_wrong_answers')

const score_reset_regex = Joi.object({
  id: Joi.string().custom(objectId_validator),
  user_id: Joi.string().custom(objectId_validator),
})
  .xor('id', 'user_id')
  .with('id', 'user_id')

export {
  score_regex,
  score_reset_regex
}
  