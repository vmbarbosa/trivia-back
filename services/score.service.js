import { response } from "./utils/response.js";
import Score from "../models/score.js";

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
    return response(
      false,
      "There was an error while trying to retrieve the scores.",
      scores_db
    );
  }

  const all_active_scores = scores_db.map((score) => ({
    nickname: score.user.nickname,
    score: score.score,
    correct_answers: score.id_correct_answers.length,
    incorrect_answers: score.id_wrong_answers.length,
  }));

  return response(true, "Scores retrieved successfully.", all_active_scores);
};

const reset_score = async (score_request) => {
  const { error } = score_reset_regex.validate(score_request);
  if (error) return response(false, error.details[0].message);

  const { id, user_id } = score_request;

  try {
    const score = id
      ? await Score.findById(id)
      : await Score.findOne({ user_id });

    if (!score) return response(false, "Score not found");

    score.score = 0;

    await score.save();

    return response(true, "Score reset successfully", score);
  } catch (error) {
    return response(false, "Generic bussiness error");
  }
};

export { get_all_scores, reset_score };
