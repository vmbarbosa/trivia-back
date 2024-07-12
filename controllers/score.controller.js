import { constants } from "../services/utils/constants.js"
import { get_all_scores as get_all_scores_service, reset_score as reset_score_service } from "../services/score.service.js";

const { status } = constants.response;

const get_all_scores = async (req, res) => {
    const scores_response = await get_all_scores_service(req.query);
    if (scores_response.process) return res.status(401).json(scores_response);
    res.status(status.OK).json(scores_response);
}

const reset_score = async (req, res) => {
    const scores_response = await reset_score_service(req.body);
    res.status(status.OK).json(scores_response);
}

export { 
    get_all_scores, 
    reset_score
};