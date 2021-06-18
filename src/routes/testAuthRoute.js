const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");
const router = require("express").Router();

router.post(``, authenticateToken, async (req, res) => {
    console.log("User has been authenticated");

    const curUser = await User.findById(req.user.id);
    console.log(`curUser is ${curUser}`);
    res.json({
        status: "success",
        user: req.user,
        curUser,
    });
});

module.exports = router;
