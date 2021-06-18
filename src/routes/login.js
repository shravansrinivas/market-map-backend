const userController = require("../controllers/User.js");
const router = require("express").Router();

router.post(``, userController.login);

module.exports = router;
