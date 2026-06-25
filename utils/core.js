const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Msg = (res, msg = "", result = {}) => {
    res.status(200).json({
        condition: true,
        message: msg,
        result
    });
}

const Encoder = {
    encode: (password) => bcrypt.hashSync(password, 10),
    compare: (plain, hash) => bcrypt.compare(plain, hash)
}
const Token = {
    make: (payload) => JWT.sign(payload, process.env.MY_SECRET, { expiresIn: 60 * 60 }), // 1 day
    // verify: (token) => JWT.verify(token, process.env.JWT_SECRET)
}
module.exports = {
    Msg,
    Encoder,
    Token
}