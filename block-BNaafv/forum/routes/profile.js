const express = require("express");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middlewares/auth");
const user = require("../models/user");

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

//follow other user
router.put("/:username/follow", auth.verifyToken, async (req, res, next) => {
  let username = req.params.username;
  try {
    let profile = await User.findOneAndUpdate(
      { username },
      { $push: { followers: req.user.id } }
    );
    let user = await User.findByIdAndUpdate(req.user.id, {
      $push: { following: profile.id },
    });
    return res.json({ profile });
  } catch (error) {
    return next(error);
  }
});

//unfollow other user
router.delete("/:username/follow", auth.verifyToken, async (req, res, next) => {
  let username = req.params.username;
  try {
    let profile = await User.findOneAndUpdate(
      { username },
      { $pull: { followers: req.user.id } }
    );
    let user = await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: profile.id },
    });
    return res.json({ profile });
  } catch (error) {
    return next(error);
  }
});

//block user by admin
router.delete("/:username/block", async (req, res, next) => {
  let username = req.params.username;
  try {
    let user = await User.findById(req.user.id);
    if (user.isAdmin) {
      let profile = await User.findOneAndUpdate(
        { username },
        { isBlocked: true }
      );
      return res.json({ profile });
    } else {
      return next("You are not authorized to do this action");
    }
  } catch (error) {
    return next(error);
  }
});

//unblock user by admin
router.put("/:username/block", async (req, res, next) => {
  let username = req.params.username;
  try {
    let user = await User.findById(req.user.id);
    if (user.isAdmin) {
      let profile = await User.findOneAndUpdate(
        { username },
        { isBlocked: false }
      );
      return res.json({ profile });
    } else {
      return next("You are not authorized to do this action");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
