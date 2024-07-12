import { response } from "./utils/response.js";
import Question from "../models/question.js";
import Score from "../models/score.js"
import { question_regex, question_result_regex, question_update_regex } from "./validations/question.validation.js";
import { questions_message } from "./utils/constants.js";
import { format_question_response } from './utils/utils.js'


const get = async user => {

  let question;

  if (!user) {
    question = await Question.aggregate([{ $sample: { size: 1 } }])
    return response(true, "question obtained", format_question_response(question))
  }

  const user_score = await Score.findOne({ user_id: user._id })
  const questions_id = [...user_score.id_correct_answers, ...user_score.id_wrong_answers]

  question = await Question.aggregate([
      { $match: { _id: { $nin: questions_id } } },
      { $sample: { size: 1 } }
  ]);

  return response(true, "question obtained", format_question_response(question))
}

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

const update = async (id, question_request) => {

  const { error } = question_update_regex.validate(question_request);
  if (error) return response(false, error.details[0].message)

  try {
      const question = await Question.findByIdAndUpdate(id, question_request, {new: true});
      
      return response(true, "Update question success", question);;
  } catch (error) {
      return response(false, error.message);
  }
}

const check_answer = async (id, question_request) => {

  const { error } = question_result_regex.validate(question_request)
  if (error) return response(false, error.details[0].message)

  const { user_id, answer } = question_request

  try {

    const question = await Question.findById(id);
    if (!question) return response(false, 'Question don\'t exist')
    
    const is_correct = question.correct_answer === answer

    const result = {
      question_id: id,
      result: is_correct,
    }

    if (user_id) {
      
      const user_score = await Score.findOne({ user_id });

      if (is_correct) {
        user_score.score += question.difficulty
        user_score.id_correct_answers.push(id)
      } else {
        user_score.score = Math.max(0, user_score.score - 1);
        user_score.id_wrong_answers.push(id);
      }

      await user_score.save();

      result.user_id = user_id
    }

    return response(true, 'Result check answer', result)
  } catch (error) {
    return response(false, error.message)
  }
};

const delete_question = async (id) => {

  try {

    const deleted = await Question.findByIdAndDelete(id)

    if (!deleted) return response(false, questions_message.question_not_found)

    return response(true, questions_message.question_deleted)
  } catch (error) {
    return response(false, questions_message.question_not_found);
  }
}

export { 
  get,
  create, 
  create_all,
  update,
  delete_question,
  check_answer
}
