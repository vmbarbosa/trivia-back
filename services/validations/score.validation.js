import Joi from "joi"
import { Types } from 'mongoose';

const objectId_validator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const score_regex = Joi.object({
  user_id: Joi.string().custom(objectId_validator).required(),
  score: Joi.number().integer().min(0).required(),
  id_correct_answers: Joi.string().custom(objectId_validator),
  id_wrong_answers: Joi.string().custom(objectId_validator)
}).xor('id_correct_answers', 'id_wrong_answers')

export default score_regex