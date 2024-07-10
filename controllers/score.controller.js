import { get_all_scores as get_all_scores_service } from "../services/score.service.js";
import { constants } from "../services/utils/constants.js"

const { status } = constants.response;

const get_all_scores = async (req, res) => {
    const scores_response = await get_all_scores_service(req.query);
    if (scores_response.process) return res.status(401).json(scores_response);
    res.status(status.OK).json(scores_response);
}

export { get_all_scores };