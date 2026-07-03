const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, enum: ["S", "M", "L", "XL"], default: "M" },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  colors: [String],
  discount: { type: Schema.Types.Double, default: 0.0 },
  category: { type: Schema.Types.ObjectId, ref: "categories", required: true },
  tags: [String],
  images: [
    {
      link: { type: String, required: true },
      desc: { type: String, required: true },
    },
  ],

  Shipping: [
    {
      name: { type: String, required: true },
      desc: { type: String, required: true },
      cost: { type: Number, required: true },
    },
  ],

  created: { type: Date, default: Date.now },
});

ProductSchema.index({ tags: 1, user: 1 });

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
