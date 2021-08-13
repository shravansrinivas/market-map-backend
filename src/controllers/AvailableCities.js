const City = require("../models/City");

module.exports = {
    availableCities: async (req, res, next) => {
        try {
            const cities = await City.aggregate([
                {
                    $group: {
                        _id: "$cityName",
                        state: { $first: "$info.generalInfo.state" },
                        latitude: {
                            $first: "$info.locationInfo.centerCoordinates.latitude",
                        },
                        longitude: {
                            $first: "$info.locationInfo.centerCoordinates.longitude",
                        },
                        lastRefreshedAt: { $first: "$lastRefreshedAt" },
                        isDataBeingFetched: { $first: "$isDataBeingFetched" },
                    },
                },
                { $addFields: { city: "$_id" } },
                { $project: { _id: 0 } },
                { $sort: { city: 1 } },
            ]);

            return res.json({ error: false, cities });
        } catch (err) {
            res.json({ error: true, errorMessage: err });
        }
    },
};
