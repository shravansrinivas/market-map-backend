const City = require("../models/City");

// GET ALL CITIES WITH STATE NAMES
module.exports.handleGetAllCitiesWithState = async (req, res) => {
  try {
    let cities = await City.aggregate([
      {
        $group: {
          _id: "$cityName",
          state: { $first: "$info.generalInfo.state" },
          latitude: {$first: "$info.locationInfo.centerCoordinates.latitude"},
          longitude: {$first: "$info.locationInfo.centerCoordinates.longitude"}
        },
      },
      { $addFields: { city: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: {city:1}}
    ]);
    return res.json({ error: false, cities });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
