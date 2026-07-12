const catDB = require("../models/category");
const { Msg } = require("../utils/core");

const all = async (req, res, next) => {
  try {
    let categories = await catDB.find();
    Msg(res, true, "All categories", categories);
  } catch (error) {
    console.log(error);
  }
};

const getById = async (req, res, next) => {};

const add = async (req, res, next) => {
  try {
    let dbCat = await catDB.findOne({ name: req.body.name });
    if (dbCat) {
      next(new Error("Category already exists"));
    } else {
      let saveCat = new catDB(req.body).save();
      Msg(res, true, "Category added successfully", saveCat);
    }
  } catch (error) {
    console.log(error);
  }
};

const modify = async (req, res, next) => {};

const remove = async (req, res, next) => {};

module.exports = {
  all,
  getById,
  add,
  modify,
  remove,
};
