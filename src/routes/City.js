const { handleGetAllCitiesWithState } = require("../controllers/City");

const router = require("express").Router();

// get all cities with state
router.get(``, handleGetAllCitiesWithState);

module.exports = router;
