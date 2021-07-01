const userController = require("../controllers/User.js");
const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");

router.get(`/:id`, userController.getUser);

module.exports = router;
