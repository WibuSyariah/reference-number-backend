const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");

dotenv.config()

const env = process.env

const payloadToToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const tokenToPayload = (token) => {
  return jwt.verify(token, env.JWT_SECRET_KEY);
};

module.exports = {
  payloadToToken,
  tokenToPayload,
};
