const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const payloadToToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

const tokenToPayload = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = {
  payloadToToken,
  tokenToPayload,
};
