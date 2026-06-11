const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['BUYER', 'SELLER'], default: 'BUYER' },
    unit: { type: Schema.Types.Int32, default: 0 },
    created: { type: Date, default: Date.now }

});

const User = mongoose.model('users', UserSchema);

module.exports = User;