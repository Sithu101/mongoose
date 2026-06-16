
const { Msg } = require('../utils/core');
const userdbCollection = require('../models/user_model');

const register = async (req, res, next) => {
    let name = req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;

    try {
        await new userdbCollection({
            name,
            phone,
            password
        }).save();

        Msg(res, "User registered successfully", req.body);

    } catch (error) {
        let errMsg = error.message.split(":")[0];
        next(new Error(errMsg));
    }
}

module.exports = {
    register
}