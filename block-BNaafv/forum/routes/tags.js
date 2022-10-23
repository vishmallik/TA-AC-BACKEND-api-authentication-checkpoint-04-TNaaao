const express = require("express");
const Question = require("../models/question");
const router = express.Router();

router.get("/", async function (req, res, next) {
  let tags = [];
  try {
    let question = await Question.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
        },
      },
    ]);
    question.forEach((tag) => {
      tags.push(tag._id);
    });
    return res.json({ tags: tags.flat(1) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
