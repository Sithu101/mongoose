
const { Msg, Encoder, Token } = require('../utils/core');
const userdbCollection = require('../models/user_model');

const register = async (req, res, next) => {
    let name = req.body.name.toLowerCase();
    let phone = req.body.phone;
    let password = req.body.password;

    try {

        let namedUser = await userdbCollection.findOne({ name });
        if (namedUser) {
            next(new Error("Name already exists"));
            return;

        }

        let phoneUser = await userdbCollection.findOne({ phone });
        if (phoneUser) {
            next(new Error("Phone number already exists"));
            return;
        }

        let encodedPass = Encoder.encode(password)
        await new userdbCollection({
            name,
            phone,
            password: encodedPass
        }).save();
        Msg(res, "User registered successfully");

    } catch (error) {
        console.log(error)
    }
}
const login = async (req, res, next) => {
    let name = req.body.name.toLowerCase();
    let password = req.body.password;

    let dbuser = await userdbCollection.findOne({ name });
    if (!dbuser) {
        next(new Error("User not found"));
        return;
    }
    if (!Encoder.compare(password, dbuser.password)) {
        next(new Error("Invalid password"));
        return;
    }

    let token = Token.make({ id: dbuser._id.toString()});

    Msg(res, "Login successful", { token })
}
const takeME = async (req, res, next) => {

    let user = await userdbCollection.findById(req.userId).select("-password -__v")
    Msg(res,"User info", {user})
}
module.exports = {
    register,
    login,
    takeME
}