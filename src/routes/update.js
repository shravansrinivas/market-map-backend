const userController = require("../controllers/User.js");
const router = require("express").Router();

router.put(``, userController.update);

module.exports = router;
