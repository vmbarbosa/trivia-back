import { response } from "./utils/response.js";
import Score from "../models/score.js";

const get_all_scores = async (queryParams) => {
    const { page = 1, pageSize = 50 } = queryParams;
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
        return response(
            false,
            "There was an error while trying to retrieve the scores.",
            scores_db
        );
    }

    const all_active_scores = scores_db.map((scoreObj) => ({
        nickname: scoreObj.user.nickname,
        score: scoreObj.score,
        correct_answers: scoreObj.id_correct_answers.length,
        incorrect_answers: scoreObj.id_wrong_answers.length,
    }));

    return response(true, "Scores retrieved successfully.", all_active_scores);
};

export { get_all_scores };
