const {
  handleGetAllEstablishmentsInACity,
  handleGetTopMarketAreasInACity,
  getLocationAdvisorScore,
  getEstablishmentsAroundAnAddress,
  handlePostEstablishment,
} = require("../controllers/Establishment");

const router = require("express").Router();

//top market areas in a city
router.get(`/top-market-areas/:cityName`, handleGetTopMarketAreasInACity);

// establishments around an address
router.put(`/aroundAddress`, getEstablishmentsAroundAnAddress);

// get all cities with state
router.get(`/:cityName`, handleGetAllEstablishmentsInACity);

// location advisor
router.put(`/locationadvisor`, getLocationAdvisorScore);

router.post(`/newshop`,handlePostEstablishment);

module.exports = router;
