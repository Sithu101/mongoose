const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("async-redis").createClient();
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

const DTime = {
  now: () => moment().tz("Asia/Yangon").format("YYYY-MM-DD"),
  time: () => moment().tz("Asia/Yangon").unix(),
};

const RDB = {
  set: async (key, value) => await redis.set(key, JSON.stringify(value)),
  get: async (key) => JSON.parse(await redis.get(key)),
  del: async (key) => await redis.del(key),
};

const ErrorFile = {
  write: (data) => {
    let filename = DTime.now() + "_" + DTime.time() + ".txt";
    let filePath = path.join(__dirname, "../error/" + filename);
    fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
  },
  read: (filename) => {
    let filePath = path.join(__dirname, "../error/" + filename + ".txt");
    let data = fs.readFileSync(filePath, { encoding: "utf-8" });
    return JSON.parse(data);
  },
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
    JWT.sign(payload, process.env.MY_SECRET, { expiresIn: 60 * 60 }), // 1 hour
};
module.exports = {
  Msg,
  Encoder,
  Token,
  RDB,
  DTime,
  ErrorFile,
};
