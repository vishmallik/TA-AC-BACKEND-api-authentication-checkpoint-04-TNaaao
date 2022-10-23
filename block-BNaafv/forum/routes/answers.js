const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Answer = require("../models/answer");
const User = require("../models/user");
const Question = require("../models/question");

router.get(auth.verifyToken);

//update answer
router.put("/:answerId", async function (req, res, next) {
  let answerId = req.params.answerId;
  try {
    let answer = await Answer.findByIdAndUpdate(answerId, req.body);
    return res.json({ answer });
  } catch (error) {
    return next(error);
  }
});

//update answer
router.delete("/:answerId", async function (req, res, next) {
  let answerId = req.params.answerId;
  try {
    let answer = await Answer.findByIdAndDelete(answerId);
    let user = await User.findOneAndUpdate(
      { answers: answer.id },
      { $pull: { answers: answer.id } }
    );
    let question = await Question.findOneAndUpdate(
      { answers: answer.id },
      { $pull: { answers: answer.id } }
    );
    return res.json({ answer });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
