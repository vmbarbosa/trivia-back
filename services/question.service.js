import { response } from "./utils/response.js";
import Question from "../models/question.js";
import question_regex from "./validations/question.validation.js";
import { questionsMessage } from "./utils/constants.js";

const createAll = async (questionRequest) => {
  const wrongQuestions = [];
  const correctQuestions = [];

  questionRequest.forEach((question) => {
    const { error } = question_regex.validate(question);
    if (error) {
      question.error = error.details[0].message;
      wrongQuestions.push(question);
    } else {
      const question_db = new Question(question);
      correctQuestions.push(question_db);
    }
  });

  const newQuestions = await Question.insertMany(correctQuestions);

  const res = {
    wrong: wrongQuestions,
    correct: newQuestions,
  };

  const message = wrongQuestions.length
    ? questionsMessage.wrong
    : questionsMessage.correct;

  return response(true, message, res);
};

export { createAll };

