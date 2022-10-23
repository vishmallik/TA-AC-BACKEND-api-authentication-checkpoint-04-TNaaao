const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Question = require("../models/question");
const Answer = require("../models/answer");

//create question
router.post("/", auth.verifyToken, async function (req, res, next) {
  if (req.body.tags) {
    req.body.tags = req.body.tags
      .trim()
      .split(",")
      .reduce((acc, tag) => {
        if (tag) {
          acc.push(tag.trim());
        }
        return acc;
      }, []);
  }
  req.body.author = req.user.id;
  try {
    let question = await Question.create(req.body);
    return res.json({ question });
  } catch (error) {
    return next(error);
  }
});

//list questions
router.get("/", async (req, res, next) => {
  try {
    let questions = await Question.find(
      {},
      "title author description slug tags"
    ).populate("author");
    return res.json({ questions });
  } catch (error) {
    return next(error);
  }
});

//update question
router.put("/:slug", auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let question = await Question.findOneAndUpdate({ slug }, req.body);
    return res.json({ question });
  } catch (error) {
    return next(error);
  }
});

//delete question
router.delete("/:slug", auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let question = await Question.findOneAndDelete({ slug });
    let answers = await Answer.deleteMany({ questionId: question.id });
    return res.json({ question });
  } catch (error) {
    return next(error);
  }
});

//add answer
router.post("/:slug/answers", auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let question = await Question.findOne({ slug });
    req.body.author = req.user.id;
    req.body.questionId = question.id;
    let answer = await Answer.create(req.body);
    let updatedQuestion = await Question.findOneAndUpdate(
      { slug },
      { $push: { answers: answer.id } }
    );
    return res.json({ answer });
  } catch (error) {
    return next(error);
  }
});

//list answer
router.get("/:slug/answers", auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let question = await Question.findOne({ slug });
    let answers = await Answer.find({ questionId: question.id }).populate(
      "author",
      "username"
    );
    return res.json({ answers });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
