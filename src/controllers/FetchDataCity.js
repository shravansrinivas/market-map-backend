const { main: fetchDataCity } = require("../utilities/FetchDataCity");
const City = require("../models/City");

module.exports = {
    fetchDataCityController: async (req, res, next) => {
        const { cityName } = req.params;

        if (!cityName) {
            return res.json({ error: true, message: "City name is required" });
        }

        const doc = await City.findOne({ cityName });
        if (!doc) {
            return res.json({
                error: true,
                message: "Cannot find city in the database",
            });
        }

        console.log(doc);

        // update last refreshed at date for the city
        const lastRefreshedAt = Date.now();
        doc.lastRefreshedAt = lastRefreshedAt;

        // setting isBeingFetched to true
        doc.isDataBeingFetched = true;

        // saving the changes
        await doc.save();

        fetchDataCity(cityName);

        res.json({
            error: false,
            msg: `Data fetching for ${cityName} has been queued`,
        });
    },
};
