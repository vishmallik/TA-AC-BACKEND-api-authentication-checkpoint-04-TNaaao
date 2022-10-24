const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  AnswerId: { type: Schema.Types.ObjectId, ref: "Answer" },
});

module.exports = mongoose.model("Comment", commentSchema);
