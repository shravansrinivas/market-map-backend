const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.json({ auth: false, message: "You don't have a token" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.json({
                auth: false,
                message: "Failed to authenticate",
                error: err,
            });
        }

        req.user = user;
        return next();
    });
};
module.exports = authenticateToken;
