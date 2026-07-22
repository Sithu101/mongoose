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

const safeParse = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'string') return value;
  // Try direct parse
  try {
    return JSON.parse(value);
  } catch (e) {
    // Remove backslashes that may have been added by shell quoting (e.g. "[\"a\"]")
    try {
      const cleaned = value.replace(/\\+/g, '');
      return JSON.parse(cleaned);
    } catch (e2) {
      // As a last resort, split by comma for simple lists (e.g. "a,b")
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
  }
};

const add = async (req, res, next) => {
  try {
    req.body.user = req.userId;

    req.body.colors = safeParse(req.body.colors) || [];
    req.body.tags = safeParse(req.body.tags) || [];
    req.body.Shipping = safeParse(req.body.Shipping) || [];

    let product = await new productDB(req.body).save();

    console.log('Saved product:', product._id);
    Msg(res, "Product added successfully", product);
  } catch (error) {
    console.log(error);
    next(new Error('Failed to create product'));
  }
};

module.exports = {
  add,
  getById,
  paginate,
};
