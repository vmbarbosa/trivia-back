import { response } from "./utils/response.js";
import Question from "../models/question.js";
import { question_regex, regex_upd_q } from "./validations/question.validation.js";
import { questions_message } from "./utils/constants.js";
import Score from "../models/score.js"

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

const update_question = async (req, res, next) => {

  const { error } = regex_upd_q.validate(req.body);
  if (error) {
      return response(false, error.details[0].message);
      
  }

  try {
      const is_question = await Question.findByIdAndUpdate(req.params.id, req.body, {new: true});
      return response(true, "Update question success", is_question);;
      
  } catch (error) {
      return response(false, error.message);
  }
}

const getQuestion = async user => {
  try {
      let question;
      if (user) {
          const user_score = await Score.findOne({ user_id: user.user._id })
          const questions_id = [...user_score.id_correct_answers, ...user_score.id_wrong_answers]
          question = await Question.aggregate([
              { $match: { _id: { $nin: questions_id } } },
              { $sample: { size: 1 } }
          ]);
      } else {
          question = await Question.aggregate([{ $sample: { size: 1 } }]);
      }
      const answer = formatQuestionResponse(question)
      return response(true, "question obtained", answer)
  } catch (error) {
      return response(false, "error getting the question")
  }
}

const formatQuestionResponse  = (inbound_question) => {
  const { _id, difficulty, question, wrong_answer, correct_answer } = inbound_question[0]

  const options = [...wrong_answer, correct_answer].sort(() => Math.random() - 0.5)
  const question_response = {
      "_id": _id,
      "difficulty": difficulty,
      "question": question,
      "options": options
  }
  return question_response
}

export { 
  create, 
  create_all,
  update_question,
  getQuestion
}
