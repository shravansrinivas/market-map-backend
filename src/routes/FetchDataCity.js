const { fetchDataCityController } = require("../controllers/FetchDataCity");
const authenticateToken = require("../middleware/authenticateToken");

const router = require("express").Router();

// get all cities with state
router.post(`/:cityName`, authenticateToken, fetchDataCityController);

module.exports = router;
