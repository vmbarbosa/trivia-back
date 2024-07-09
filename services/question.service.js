import { response } from "./utils/response.js"
import Question from '../models/question.js'
import question_regex from "./validations/question.validation.js"

const question = async (question_request) => {

    const { error } = question_regex.validate(question_request)
    if (error) return response(false, error.details[0].message)
    if (question_request.question.startsWith('¿') && question_request.question.charAt(1) !== question_request.question.charAt(1).toUpperCase()) {
        return response(false, 'The first letter after the opening question mark must be capitalized.')
    }
    if (question_request.question.charAt(0) !== question_request.question.charAt(0).toUpperCase()) {
        return response(false, 'The first letter must be capitalized.')
    }
    if (!question_request.question.endsWith('?')) {
        return response(false, 'The question must end with a question mark.');
    }
    const is_question = await Question.findOne({ question: question_request.question })
    if (is_question) {
        return response(false, 'Question already exist.')
    }
    const question_db = new Question(question_request)
    const new_question = await question_db.save()
    return response(true, 'Question created.', new_question)
}
export default question