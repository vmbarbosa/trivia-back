import { Schema, model } from "mongoose";

const score_schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    id_correct_answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "question",
      },
    ],
    id_wrong_answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "question",
      },
    ],
  },
  { 
    timestamps: true
  }
);

export default model("score", score_schema);
