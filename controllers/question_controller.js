import question_service from "../services/question.service.js"
import { constants } from "../services/utils/constants.js"

const { status } = constants.response


const question = async (req, res) => {
    const question_db = await question_service(req.body)
    res.status(status.OK).json(question_db)
}

export default question