import { response } from "./utils/response.js";
import Question from "../models/question.js";
import Score from "../models/score.js"
import { question_regex, question_update_regex } from "./validations/question.validation.js";
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

    const { error } = question_regex.validate(question_request)
    if (error) 
        return response(false, error.details[0].message)

    if (question_request.question.startsWith('¿') && question_request.question.charAt(1) !== question_request.question.charAt(1).toUpperCase()) 
        return response(false, 'The first letter after the opening question mark must be capitalized.')

    if (question_request.question.charAt(0) !== question_request.question.charAt(0).toUpperCase())
        return response(false, 'The first letter must be capitalized.')

    if (!question_request.question.endsWith('?'))
        return response(false, 'The question must end with a question mark.');

    const is_question = await Question.findOne({ question: question_request.question })
    if (is_question) return response(false, 'Question already exist.')

    const question = new Question(question_request)

    await question.save()

    return response(true, 'Question created.', question)
}

const create_all = async (question_request) => {

  const wrong_questions = []
  const correct_questions = []

  question_request.forEach(question => {
    const { error } = question_regex.validate(question);
    if (error) {
      question.error = error.details[0].message;
      wrong_questions.push(question);
    } else {
      const question_db = new Question(question);
      correct_questions.push(question_db);
    }
  })

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

const check_answer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(status.not_found).json(response(false, message.not_found));
    }

    const is_correct = question.correct_answer === answer;

    const result = {
      question_id: id,
      result: is_correct,
    };

    return { result, question };
  } catch (error) {
    return res.status(status.svr_error).json(response(false, error.message));
  }
}

const save_score = async (req, res, validation, question) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    let user_score = await Score.findOne({ user_id });
    if (!user_score) {
      user_score = new Score({ user_id, score: 0, id_correct_answers: [], id_wrong_answers: [] });
    }
    if (validation.result) {
      user_score.score += question.difficulty;
      user_score.id_correct_answers.push(id);
    } else {
      user_score.score = Math.max(0, user_score.score - 1);
      user_score.id_wrong_answers.push(id);
    }
    await user_score.save();
    validation.user_id = user_id;
  } catch (error) {
    return res.status(status.svr_error).json(response(false, error.message));
  }

}

const return_answer_validation = async (req, res, result) => {
  try {
    return res.status(status.OK).json(response(true, "Pregunta verificada", result));
  } catch (error) {
    return res.status(status.svr_error).json(response(false, error.message));
  }
}

export { 
  get,
  create, 
  create_all,
  update,
  check_answer,
  save_score,
  return_answer_validation
}
