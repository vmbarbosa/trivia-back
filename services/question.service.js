import { response } from "./utils/response.js";
import Question from "../models/question.js";
import {
  question_regex,
  regex_upd_q,
} from "./validations/question.validation.js";
import { questions_message } from "./utils/constants.js";

const create = async (question_request) => {
  const { error } = question_regex.validate(question_request);
  if (error) return response(false, error.details[0].message);

  if (
    question_request.question.startsWith("¿") &&
    question_request.question.charAt(1) !==
      question_request.question.charAt(1).toUpperCase()
  )
    return response(
      false,
      "The first letter after the opening question mark must be capitalized."
    );

  if (
    question_request.question.charAt(0) !==
    question_request.question.charAt(0).toUpperCase()
  )
    return response(false, "The first letter must be capitalized.");

  if (!question_request.question.endsWith("?"))
    return response(false, "The question must end with a question mark.");

  const is_question = await Question.findOne({
    question: question_request.question,
  });
  if (is_question) return response(false, "Question already exist.");

  const question = new Question(question_request);

  await question.save();

  return response(true, "Question created.", question);
};

const create_all = async (question_request) => {
  const wrong_questions = [];
  const correct_questions = [];

  question_request.forEach((question) => {
    const { error } = question_regex.validate(question);
    if (error) {
      question.error = error.details[0].message;
      wrong_questions.push(question);
    } else {
      const question_db = new Question(question);
      correct_questions.push(question_db);
    }
  });

  const newQuestions = await Question.insertMany(correct_questions);

  const res = {
    wrong: wrong_questions,
    correct: newQuestions,
  };

  const message = wrong_questions.length
    ? questions_message.wrong
    : questions_message.correct;

  return response(true, message, res);
};
const update_question = async (req, res, next) => {
  const { error } = regex_upd_q.validate(req.body);
  if (error) {
    return response(false, error.details[0].message);
  }

  try {
    const is_question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return response(true, "Update question success", is_question);
  } catch (error) {
    return response(false, error.message);
  }
};
const delete_question_by_id = async (req) => {
  const { id } = req.params;

  try {
    const numDoc = await Question.countDocuments({});
    if (numDoc == 0) return response(false, "Collection is empty");
    const questionDeleted = await Question.findByIdAndDelete(id);
    if (questionDeleted) {
      return response(true, questions_message.question_deleted);
    } else {
      return response(false, questions_message.question_not_found);
    }
  } catch (error) {
    return response(false, questions_message.question_not_found);
  }
};

export { create, create_all, update_question, delete_question_by_id };
