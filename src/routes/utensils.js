const {
    handleUtensilStorePostEstablishment
  } = require("../controllers/utensils");
  
  const router = require("express").Router();
  
  //top market areas in a city
  router.get(``, handleUtensilStorePostEstablishment);
  
  
  module.exports = router;
  