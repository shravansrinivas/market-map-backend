const CityRoutes = require("../routes/City");
const EstablishmentRoutes = require("../routes/Establishment");
const SubcategoryRoutes = require("../routes/LeCategories");
const LocationAdvisorSchemeRoutes = require("../routes/LocationAdvisorScheme");
const PrestigeStoresRoutes = require("../routes/PrestigeStores");

module.exports = (app) => {
  // City routes
  app.use(`/city`, CityRoutes);

  //Establishment routes
  app.use(`/establishments`, EstablishmentRoutes);

  // subcategories route
  app.use(`/subcategories`, SubcategoryRoutes);

  // location advisor schemes
  app.use(`/schemes`, LocationAdvisorSchemeRoutes);

  // prestige stores
  app.use(`/prestige-stores`, PrestigeStoresRoutes);
};
