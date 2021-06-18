const userController = require("../controllers/User.js");
const router = require("express").Router();

router.delete(``, userController.delete);

module.exports = router;
