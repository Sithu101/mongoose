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

  let v = value.trim();

  // Strip surrounding quotes that some clients add
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }

  // Try JSON.parse directly
  try {
    return JSON.parse(v);
  } catch (e) {
    // Replace escaped quotes and escaped backslashes, then try parse
    try {
      const step1 = v.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      return JSON.parse(step1);
    } catch (e2) {
      // Remove any remaining backslashes and try
      try {
        const cleaned = v.replace(/\\+/g, '');
        return JSON.parse(cleaned);
      } catch (e3) {
        // Fallback: if it looks like comma-separated values, return array
        if (v.indexOf(',') !== -1) return v.split(',').map(s => s.trim()).filter(Boolean);
        // Otherwise return original string
        return value;
      }
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
    console.error('Product create error:', error && error.stack ? error.stack : error);
    // For debugging return the error details directly (remove or limit in production)
    return res.status(500).json({ condition: false, message: 'Something went wrong', error: error.message, stack: error.stack });
  }
};

module.exports = {
  add,
  getById,
  paginate,
};
