const catDB = require("../models/category");
const { Msg } = require("../utils/core");
const { deleteImage } = require("../utils/gallery");

const all = async (req, res, next) => {
  try {
    let categories = await catDB.find();
    Msg(res, "All categories", categories);
  } catch (error) {
    console.log(error);
  }
};

const getById = async (req, res, next) => {
  try {
    let cat = await catDB.findById(req.params.id);
    if (cat) {
      Msg(res, "Category found", cat);
    } else {
      next(new Error("Category not found"));
    }
  } catch (error) {
    console.log(error);
  }
};

const add = async (req, res, next) => {
  let dbCat = await catDB.findOne({ name: req.body.name });
  if (dbCat) {
    next(new Error("Category already exists"));
  } else {
    let saveCat = await new catDB(req.body).save();
    Msg(res, "Category added successfully", saveCat);
  }
};

const modify = async (req, res, next) => {
  try {
    let dbCat = await catDB.findById(req.params.id);
    if (!dbCat) {
      next(new Error("Category not found"));
    } else {
      let updateCat = await catDB.findByIdAndUpdate(dbCat._id, req.body, {
        new: true,
      });
      Msg(res, "Category updated successfully", updateCat);
    }
  } catch (error) {
    console.log(error);
    next(new Error("Failed to update category"));
  }
};

const remove = async (req, res, next) => {};

module.exports = {
  all,
  getById,
  add,
  modify,
  remove,
};
