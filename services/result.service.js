
import Question from "../models/question.js";
import Score from "../models/score.js";
import { constants } from "../services/utils/constants.js";
import { response } from "../services/utils/response.js";

const { status, message } = constants.response;

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

export { check_answer, save_score, return_answer_validation }