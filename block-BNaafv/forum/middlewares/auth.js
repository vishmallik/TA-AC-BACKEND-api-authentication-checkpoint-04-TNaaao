const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async function (req, res, next) {
    let token = req.headers.authorization;
    try {
      if (token) {
        let payload = await jwt.verify(token, process.env.secret);
        req.user = payload;
        req.user.token = token;
        return next();
      } else {
        return next("Token Required");
      }
    } catch (error) {
      next(error);
    }
  },
};
