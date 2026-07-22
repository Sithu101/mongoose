const express = require("express");
const router = express.Router();
const { verifyToken } = require ("../utils/validators");
const Controller = require("../controllers/product");
const  {saveMultiple} = require("../utils/gallery");
const Product = require("../models/product_model");
const Category = require("../models/category");

router.post("/", verifyToken , saveMultiple, Controller.add);
// JSON endpoint without file upload middleware
router.post('/json', verifyToken, Controller.add);
router.post('/test-save', verifyToken, async (req, res) => {
  try {
    const cat = await Category.findOne();
    if (!cat) return res.status(400).json({ condition: false, message: 'No category exists to link' });
    const product = new Product({
      name: 'TEST-SAVE',
      price: 1,
      size: 'M',
      user: req.userId,
      colors: ['red'],
      discount: 0,
      category: cat._id,
      tags: ['test'],
      images: [{ link: 'http://localhost:3000/images/1784616945694_aaaaa.jpg', desc: 'test' }],
      Shipping: [{ name: 'Std', desc: 'standard', cost: 0 }]
    });
    const saved = await product.save();
    res.json({ condition: true, message: 'Saved', result: saved });
  } catch (e) {
    console.error('test-save error', e);
    res.status(500).json({ condition: false, message: 'Failed', error: e.message });
  }
});

router.get("/:id", verifyToken, Controller.getById);
router.get('/paginate/:index', verifyToken, Controller.paginate)


module.exports = router;