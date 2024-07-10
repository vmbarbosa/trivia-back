import { constants } from "../services/utils/constants.js"
import {resetscore as resetscore_service} from "../services/score.service.js";


const { status, message} = constants.response

const resetscore = async (req,res) =>{

    const score_db = await resetscore_service(req.body)

    res.status(score_db[0]).json(score_db[1])
}
export {
    resetscore
}