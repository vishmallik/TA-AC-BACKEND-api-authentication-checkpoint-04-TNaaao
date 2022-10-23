const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, minlength: 8 },
  image: String,
  email: { type: String, unique: true, required: true, match: /@/ },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  bio: String,
});

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  let payload = {
    id: this.id,
    username: this.username,
    email: this.email,
  };
  try {
    let token = jwt.sign(payload, process.env.secret);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = async function (token) {
  return {
    token,
    email: this.email,
    username: this.username,
  };
};

module.exports = mongoose.model("User", userSchema);
