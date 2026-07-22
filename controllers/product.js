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

    // Debug incoming raw values
    console.log('Incoming raw fields:', {
      colors: req.body.colors,
      tags: req.body.tags,
      Shipping: req.body.Shipping,
      types: {
        colorsType: typeof req.body.colors,
        tagsType: typeof req.body.tags,
        ShippingType: typeof req.body.Shipping,
      },
    });

    const colors = safeParse(req.body.colors) || [];
    const tags = safeParse(req.body.tags) || [];
    const shippingRaw = safeParse(req.body.Shipping) || [];

    // Normalize shipping entries to objects with proper types
    const Shipping = Array.isArray(shippingRaw)
      ? shippingRaw.map((s) => {
          if (!s || typeof s !== 'object') return null;
          return {
            name: s.name || String(s.name || ''),
            desc: s.desc || String(s.desc || ''),
            cost: Number(s.cost) || 0,
          };
        }).filter(Boolean)
      : [];

    // Ensure images are present (set by saveMultiple middleware)
    const images = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);

    const productData = {
      name: req.body.name,
      price: Number(req.body.price) || 0,
      size: req.body.size || 'M',
      user: req.body.user,
      colors: Array.isArray(colors) ? colors.map(String) : [],
      discount: Number(req.body.discount) || 0,
      category: req.body.category,
      tags: Array.isArray(tags) ? tags.map(String) : [],
      images,
      Shipping,
    };

    console.log('Saving product data:', productData);

    let product = await new productDB(productData).save();

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
