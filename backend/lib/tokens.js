require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return refreshToken;
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
