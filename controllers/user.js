

const register = async (req, res, next) => {
    console.log(req.body);
    res.status(200).json({
        message: 'User registered successfully',rest: req.body
    });
}

module.exports = {
    register
}