const productDB = require("../models/product_model");
const { Msg } = require("../utils/core");

const paginate = async (req, res, next) => {
  let pageIndex = Number(req.params.index);
  let productCount = 2;
  let products = await productDB
    .find()
    .skip(productCount * pageIndex)
    .limit(productCount);
  Msg(res, "product indexed", products);
};
const getById = async (req, res, next) => {
  let product = await productDB
    .findById(req.params.id)
    .populate("user", "name phone");
  if (product) {
    Msg(res, "Product found", product);
    return;
  }
  next(new Error("no product with id"));
};
const add = async (req, res, next) => {
  req.body.user = req.userId;

  req.body.colors = JSON.parse(req.body.colors);
  req.body.tags = JSON.parse(req.body.tags);
  req.body.Shipping = JSON.parse(req.body.Shipping);

  let product = await new productDB(req.body).save();

  console.log(req.body);
  Msg(res, "Product added successfully", product);
};

module.exports = {
  add,
  getById,
  paginate,
};
