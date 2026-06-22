
const { Msg } = require('../utils/core');
const userdbCollection = require('../models/user_model');

const register = async (req, res, next) => {
    let name = req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;

    try {
        let namedUser = await userdbCollection.findOne({ name });
        if (namedUser) {
            return next(new Error("Name already exists"));
        } else {
            let phoneUser = await userdbCollection.findOne({ phone });
            if (phoneUser) {
                return next(new Error("Phone number already exists"));
            } else {
                await new userdbCollection({
                    name,
                    phone,
                    password
                }).save();
                return Msg(res, "User registered successfully", req.body);
            }
        }
        await new userdbCollection({
            name,
            phone,
            password
        }).save();

        return Msg(res, "User registered successfully", req.body);

    } catch (error) {
        let errMsg = error.message.split(":")[0];
        return next(new Error(errMsg));
    }
}

module.exports = {
    register
}