const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");

const answerSchema = new Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
});

module.exports = mongoose.model("Answer", answerSchema);
