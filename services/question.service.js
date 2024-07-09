import { response } from "./utils/response.js"
import Question from "../models/question.js"
import Score from "../models/score.js"

const getQuestion = async user => {
    try {

        let question;
        if (user) {
            const user_score = await Score.findOne({ user_id: user.id })
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

export { getQuestion };