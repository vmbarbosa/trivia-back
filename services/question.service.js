import { response } from "./utils/response.js";
import Question from "../models/question.js";
import question_regex from "./validations/question.validation.js";

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
    ? "Some questions were not created successfully"
    : "All questions were created successfully";

  return response(true, message, res);
};

export { createAll };
