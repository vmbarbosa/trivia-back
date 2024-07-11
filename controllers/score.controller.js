import { constants } from "../services/utils/constants.js"
import { resetscore as resetscore_service, get_all_scores as get_all_scores_service } from "../services/score.service.js";

const { status, message } = constants.response;

const resetscore = async (req, res) => {
    const score_db = await resetscore_service(req.body);
    res.status(score_db[0]).json(score_db[1]);
}

const get_all_scores = async (req, res) => {
    const scores_response = await get_all_scores_service(req.query);
    if (scores_response.process) return res.status(401).json(scores_response);
    res.status(status.OK).json(scores_response);
}

export { resetscore, get_all_scores };