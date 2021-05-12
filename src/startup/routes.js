const CityRoutes = require("../routes/City");
const EstablishmentRoutes = require("../routes/Establishment");
const SubcategoryRoutes = require("../routes/LeCategories");
const LocationAdvisorSchemeRoutes = require("../routes/LocationAdvisorScheme");
const PrestigeStoresRoutes = require("../routes/PrestigeStores");
const RentLocationRoutes = require("../routes/RentLocation");
const AgarbattiBusinessIdeaRoutes = require("../routes/AgarbattiBusinessIdea");
const RequiredLicenses = require("../routes/RequiredLicenses");
const utensils = require("../routes/utensils");

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

  // Agarbatti Business Idea data(training details for different business ideas)
  app.use(`/agarbatti`, AgarbattiBusinessIdeaRoutes);

  app.use(`/rent`, RentLocationRoutes);
  app.use(`/utensil-stores`, utensils);

  app.use(`/requiredlicenses`, RequiredLicenses);
};
