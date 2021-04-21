const {
  handleGetAllEstablishmentsInACity,
  handleGetTopMarketAreasInACity,
  getLocationAdvisorScore,
} = require("../controllers/Establishment");

const router = require("express").Router();

//top market areas in a city
router.get(`/top-market-areas/:cityName`, handleGetTopMarketAreasInACity);

// get all cities with state
router.get(`/:cityName`, handleGetAllEstablishmentsInACity);

// location advisor
router.put(`/locationadvisor`, getLocationAdvisorScore);

module.exports = router;
