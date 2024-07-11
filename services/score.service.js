import { response } from "./utils/response.js";
import Score from "../models/score.js";
import { constants } from "../services/utils/constants.js";

const { status, message } = constants.response;

const resetscore = async (user_request) => {
    const { user_id, id } = user_request;
    let isscore;
    const estructure_response = [];

    try {
        if (user_id && id) {
            estructure_response.push(400);
            estructure_response.push(response(false, 'Only one id is required'));
            return estructure_response;
        } else if (user_id) {
            isscore = await Score.findOne({ user_id });
        } else if (id) {
            isscore = await Score.findById(id);
        } else {
            estructure_response.push(400);
            estructure_response.push(response(false, 'Neither user_id nor id was provided'));
            return estructure_response;
        }

        if (!isscore) {
            estructure_response.push(status.not_found);
            estructure_response.push(response(false, 'Score not found'));
            return estructure_response;
        }

        isscore.score = 0;
        isscore.id_correct_answers = [];
        isscore.id_wrong_answers = [];

        await isscore.save();

        estructure_response.push(status.OK);
        estructure_response.push(response(true, 'Score reset successfully', isscore));
        return estructure_response;

    } catch (err) {
        console.error(err.message);
        estructure_response.push(status.internal_server_error);
        estructure_response.push(response(false, 'Generic business error'));
        return estructure_response;
    }
};

const get_all_scores = async (query_params) => {
    const { page = 1, pageSize = 50 } = query_params;
    const limit = parseInt(pageSize);
    const skip = (parseInt(page) - 1) * limit;
    const scores_db = await Score.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $match: {
                "user.active": true,
            },
        },
        {
            $project: {
                score: 1,
                id_correct_answers: 1,
                id_wrong_answers: 1,
                createdAt: 1,
                updatedAt: 1,
                "user.name": 1,
                "user.nickname": 1,
                "user.email": 1,
            },
        },
        {
            $sort: { score: -1 }, // Sort by score in descending order
        },
        { $skip: skip },
        { $limit: limit },
    ]);

    if (!scores_db) {
        return response(false, "There was an error while trying to retrieve the scores.", scores_db);
    }

    const all_active_scores = scores_db.map((score) => ({
        nickname: score.user.nickname,
        score: score.score,
        correct_answers: score.id_correct_answers.length,
        incorrect_answers: score.id_wrong_answers.length,
    }));

    return response(true, "Scores retrieved successfully.", all_active_scores);
};

export { resetscore, get_all_scores };
