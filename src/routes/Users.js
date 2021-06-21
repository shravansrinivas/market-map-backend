const router = require("express").Router();
const userController = require("../controllers/User.js");

router.get(``, userController.getUsers);

module.exports = router;
