const express = require('express');
const router = express.Router();
const Controller = require('../controllers/user');
const JWT = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    let authToken = req.headers.authorization;
    if (authToken) {
        let token = authToken.split(" ")[1];

        JWT.verify(token, process.env.MY_SECRET, (err, decoded) => {
            if (err) {
                if (err.message === "jwt expire") {
                    next(new Error ("token expire"))
                } else {
                    next(new Error("tokenization Error"))
                }
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    } else {
        next(new Error("Token not found"));
    }

}

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.get('/me', verifyToken, Controller.takeME);

module.exports = router;