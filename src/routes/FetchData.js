const { main } = require("../utilities/FetchData");

const router = require("express").Router();

// get all cities with state
router.post(``, main);

module.exports = router;
