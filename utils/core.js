const Msg = (res, msg = "", result = {}) => {
    res.status(200).json({
        condition: true,
        message: msg,
        result
    });
}

module.exports = {
    Msg
}