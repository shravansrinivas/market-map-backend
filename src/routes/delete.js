const userController = require("../controllers/User.js");
const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");

router.delete(``, authenticateToken, userController.delete);

module.exports = router;
