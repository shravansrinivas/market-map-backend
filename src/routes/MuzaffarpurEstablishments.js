const MuzaffarpurEstablishmentController = require("../controllers/MuzaffarpurEstablishments");
const router = require("express").Router();

router.get(``, MuzaffarpurEstablishmentController.getMuzaffarpurEstablishments);

module.exports = router;
