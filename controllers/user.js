const { Msg, Encoder, Token } = require("../utils/core");
const userdbCollection = require("../models/user_model");
const { setCacheUser } = require("../utils/caches");

const register = async (req, res, next) => {
  let name = req.body.name.toLowerCase();
  let phone = req.body.phone;
  let password = req.body.password;

  try {
    let namedUser = await userdbCollection.findOne({ name });
    if (namedUser) {
      next(new Error("Name already exists"));
      return;
    }

    let phoneUser = await userdbCollection.findOne({ phone });
    if (phoneUser) {
      next(new Error("Phone number already exists"));
      return;
    }

    let encodedPass = Encoder.encode(password);
    await new userdbCollection({
      name,
      phone,
      password: encodedPass,
    }).save();
    Msg(res, "User registered successfully");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  let name = req.body.name.toLowerCase();
  let password = req.body.password;

  try {
    let dbuser = await userdbCollection.findOne({ name });

    if (!dbuser) {
      next(new Error("User not found"));
      return;
    }

    let passwordMatches = await Encoder.compare(password, dbuser.password);
    if (!passwordMatches) {
      next(new Error("Invalid password"));
      return;
    }

    let successUser = dbuser.toObject();
    delete successUser.password;

    await setCacheUser(dbuser._id.toHexString(), successUser);

    let token = Token.make({ id: dbuser._id.toString() });

    Msg(res, "Login successful", { token });
  } catch (error) {
    console.log(error);
    next(new Error("Failed to login"));
  }
};

const takeME = async (req, res, next) => {
  Msg(res, "User info", req.user);
};

module.exports = {
  register,
  login,
  takeME,
};
