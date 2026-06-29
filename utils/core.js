const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("async-redis").createClient();

const RDB = {
  set: async (key, value) => await redis.set(key, JSON.stringify(value)),
  get: async (key) => JSON.parse(await redis.get(key)),
  del: async (key) => await redis.del(key),
};

const Msg = (res, msg = "", result = {}) => {
  res.status(200).json({
    condition: true,
    message: msg,
    result,
  });
};

const Encoder = {
  encode: (password) => bcrypt.hashSync(password, 10),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
};

const Token = {
  make: (payload) =>
    JWT.sign(payload, process.env.MY_SECRET, { expiresIn: 60 * 60 }), // 1 day
};
module.exports = {
  Msg,
  Encoder,
  Token,
  RDB,
};
