const {getAllLocationAdvisorSchemes} = require('../controllers/LocationAdvisorScheme');
const router = require("express").Router();

// route to get all subcategories
router.get(``, getAllLocationAdvisorSchemes);

module.exports = router;
