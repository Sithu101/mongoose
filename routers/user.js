const express = require('express');
const router = express.Router();
const Controller = require('../controllers/user');

const verifyToken = async (req, res, next) => {
    let authToken = req.headers.authorization;
    if (authToken) {
        let token = authToken.split(" ")[1];
        console.log("Verifying token...", authToken);
        next();
    } else {
        next(new Error("Token not found"));
    }

}

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.get('/me', verifyToken, Controller.takeME);

module.exports = router;