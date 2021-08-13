const { availableCities } = require("../controllers/AvailableCities");
const router = require("express").Router();

router.get(``, availableCities);

module.exports = router;
