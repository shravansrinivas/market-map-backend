const LucknowEstablishmentsController = require("../controllers/LucknowEstablishments");
const router = require("express").Router();

router.get(``, LucknowEstablishmentsController.getLucknowEstablishments);

module.exports = router;
