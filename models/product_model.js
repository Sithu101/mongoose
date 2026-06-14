const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], default: 'M' },
    colors: [String],
    discount: { type: Schema.Types.Double, default: 0.0 },
    tags: [String],
    images: [{
        link: { type: String, required: true },
        desc: { type: String, required: true }
    }],

    Shipping: [
        {
            name: { type: String, required: true },
            desc: { type: String, required: true },
            cost: { type: Number, required: true }
        }
    ],

    created: { type: Date, default: Date.now }
});

ProductSchema.index

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;