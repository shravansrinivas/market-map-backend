const CityRoutes = require("../routes/City");
const EstablishmentRoutes = require("../routes/Establishment");
const SubcategoryRoutes = require("../routes/LeCategories");
const LocationAdvisorSchemeRoutes = require("../routes/LocationAdvisorScheme");
const PrestigeStoresRoutes = require("../routes/PrestigeStores");
const RentLocationRoutes = require("../routes/RentLocation");
const AgarbattiBusinessIdeaRoutes = require("../routes/AgarbattiBusinessIdea");
const RequiredLicenses = require("../routes/RequiredLicenses");
const utensils = require("../routes/utensils");
const loginRoute = require("../routes/login");
const registerRoute = require("../routes/register");
const updateUserRoute = require("../routes/update");
const deleteUserRoute = require("../routes/delete");
const testAuthRoute = require("../routes/testAuthRoute");
const getUsers = require("../routes/Users");
const getUser = require("../routes/getUser");
const changePasswordRoute = require("../routes/ChangePassword");
const GovernmentSchemes = require("../routes/GovernmentSchemes");
const Training = require("../routes/Training");
const FetchData = require("../routes/FetchData");
const LucknowEstablishments = require("../routes/LucknowEstablishments");
const MuzaffarpurEstablishments = require("../routes//MuzaffarpurEstablishments");
const FetchDataCity = require("../routes/FetchDataCity");
const AvailableCities = require("../routes/AvailableCities");

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

    app.use(`/required-licenses`, RequiredLicenses);

    // Authentication Routes
    app.use(`/login`, loginRoute);
    app.use(`/register`, registerRoute);

    app.use(`/update`, updateUserRoute);
    app.use(`/delete`, deleteUserRoute);

    app.use(`/testAuth`, testAuthRoute);

    app.use(`/users`, getUsers);
    app.use(`/get-user`, getUser);
    app.use(`/change-password`, changePasswordRoute);

    app.use(`/government-schemes`, GovernmentSchemes);
    app.use(`/training`, Training);

    app.use(`/get-lucknow-establishments`, LucknowEstablishments);

    app.use(`/fetch-data`, FetchData);

    app.use(`/get-muzaffarpur-establishments`, MuzaffarpurEstablishments);

    app.use(`/fetch-data/city`, FetchDataCity);

    app.use(`/available-cities`, AvailableCities);
};
