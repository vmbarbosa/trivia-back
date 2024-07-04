import { Schema, model } from "mongoose";

const question_schema = new Schema(
  {
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    wrong_answer: {
      type: [String],
      required: true,
      validate: {
        validator: (opt) => opt.length === 3,
        message: "You must have exactly 3 wrong answers.",
      },
    },
    correct_answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("question", question_schema);
