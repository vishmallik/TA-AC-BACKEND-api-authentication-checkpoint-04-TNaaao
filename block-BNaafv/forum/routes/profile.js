const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middlewares/auth");

//profile info
router.get("/:username", async function (req, res, next) {
  let username = req.params.username;
  try {
    let profile = await User.findOne({ username }, "name username image bio");
    console.log(profile);
    return res.json({ profile });
  } catch (error) {
    return next(error);
  }
});

//update profile
router.put("/:username", auth.verifyToken, async function (req, res, next) {
  let username = req.params.username;
  try {
    let profile = await User.findOneAndUpdate({ username }, req.body, {
      new: true,
    }).select("name username image bio");

    return res.json({ profile });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
