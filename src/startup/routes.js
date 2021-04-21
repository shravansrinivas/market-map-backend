const CityRoutes = require("../routes/City");
const EstablishmentRoutes = require("../routes/Establishment");
const SubcategoryRoutes = require("../routes/LeCategories");
module.exports = (app) => {
  // City routes
  app.use(`/city`, CityRoutes);

  //Establishment routes
  app.use(`/establishments`, EstablishmentRoutes);

  // subcategories route
  app.use(`/subcategories`, SubcategoryRoutes);
};
