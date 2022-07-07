const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_CODE, {
    expiresIn: "24h"
  });
};