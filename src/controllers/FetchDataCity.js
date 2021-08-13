const { main: fetchDataCity } = require("../utilities/FetchDataCity");
const City = require("../models/City");

module.exports = {
    fetchDataCityController: async (req, res, next) => {
        const { cityName } = req.params;

        if (!cityName) {
            return res.json({ error: true, message: "City name is required" });
        }

        // update last refreshed at date for the city
        const lastRefreshedAt = Date.now();
        const updatedCity = { lastRefreshedAt };
        await City.findOneAndUpdate({ cityName }, { $set: updatedCity });

        // setting isBeingFetched to true
        const updatedFlag = { isDataBeingFetched: true };
        await City.findByIdAndUpdate({ cityName }, { $set: updatedFlag });

        fetchDataCity(cityName);

        res.json({
            error: false,
            msg: `Data fetching for ${cityName} has been queued`,
        });
    },
};
