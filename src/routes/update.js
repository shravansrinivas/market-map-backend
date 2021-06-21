const userController = require("../controllers/User.js");
const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");

router.put(``, authenticateToken, userController.update);

module.exports = router;
