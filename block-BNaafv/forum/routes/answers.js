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

//delete answer
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

//upvote answer
router.put("/:answerId/vote", async (req, res, next) => {
  let answerId = req.params.answerId;
  try {
    let answer = Answer.findByIdAndUpdate(answerId, { $inc: { votes: 1 } });
    return res.json({ answer });
  } catch (error) {
    return next(error);
  }
});

//downvote answer
router.put("/:answerId/vote", async (req, res, next) => {
  let answerId = req.params.answerId;
  try {
    let answer = Answer.findByIdAndUpdate(answerId, { $inc: { votes: -1 } });
    return res.json({ answer });
  } catch (error) {
    return next(error);
  }
});

//add comment on answer
router.post("/:answerId/comments", auth.verifyToken, async (req, res, next) => {
  let answerId = req.params.answerId;
  try {
    let answer = await Answer.findById(answerId);
    req.body.author = req.user.id;
    req.body.answerId = answer.id;
    let comment = await Comment.create(req.body);
    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $push: { comments: comment.id },
    });
    return res.json({ comment });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
