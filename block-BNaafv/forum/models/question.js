const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");

const questionSchema = new Schema({
  title: String,
  description: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  tags: [String],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  slug: String,
});

questionSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("slug")) {
    this.slug = slug(this.title);
  }
  next();
});

module.exports = mongoose.model("Question", questionSchema);
