const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  votes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Answer", answerSchema);
