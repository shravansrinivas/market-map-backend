const { getAllSubcategoriesToDisplay } = require("../controllers/LeCategories");
const router = require("express").Router();

// route to get all subcategories
router.get(``, getAllSubcategoriesToDisplay);

module.exports = router;
