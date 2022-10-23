const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

/* current user*/
router.get("/current-user", auth.verifyToken, async function (req, res, next) {
  return res.json({ user: req.user });
});

//register user
router.post("/register", async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await user.signToken();
    return res.json({ user: await user.userJSON(token) });
  } catch (error) {
    if (error.code === 11000) {
      return next("User is already registered");
    }
    if (error.name === "ValidationError") {
      return next("Password should be 8 characters long");
    }
    return next(error);
  }
});

//login user
router.post("/login", async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return next("Email/Password is required");
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return next("User not found. please register first ");
    }
    let result = await user.verifyPassword(password);
    if (!result) {
      return next("Wrong Password");
    }
    let token = await user.signToken();
    return res.json({ user: await user.userJSON(token) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
