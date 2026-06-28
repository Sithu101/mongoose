const JWT = require('jsonwebtoken');
const { getCacheUser } = require('./caches')

const verifyToken = async (req, res, next) => {
    let authToken = req.headers.authorization;
    if (authToken) {
        let token = authToken.split(" ")[1];

        JWT.verify(token, process.env.MY_SECRET, async (err, decoded) => {
            if (err) {
                if (err.message === "jwt expire") {
                    next(new Error("token expire"))
                } else {
                    next(new Error("tokenization Error"))
                }
            } else {
                req.userId = decoded.id;
                req.user = await getCacheUser(decoded.id)
                next();
            }
        })

    } else {
        next(new Error("Token not found"));
    }

}

module.exports = {
    verifyToken
}