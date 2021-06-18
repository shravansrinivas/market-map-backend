const userController = require("../controllers/User.js");
const router = require("express").Router();

router.post(``, userController.create);

module.exports = router;
