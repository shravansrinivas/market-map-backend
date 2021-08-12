const { main: fetchDataCity } = require("../utilities/FetchDataCity");

module.exports = {
    fetchDataCityController: async (req, res, next) => {
        const { cityName } = req.params;
        const msg = await fetchDataCity(cityName);
        if (msg) {
            res.json({
                error: false,
                msg: `Data fetching for ${cityName} has been queued`,
            });
        }
    },
};
