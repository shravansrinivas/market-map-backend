const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  cityName: { type: String, default: "" },
  info: {
    locationInfo: {
      centerCoordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
      majorCoordinates: [
        {
          latitude: { type: Number, default: null },
          longitude: { type: Number, default: null },
        },
      ],
      boundaryCoordinates: {
        maxLat: { type: Number, default: null },
        maxLon: { type: Number, default: null },
        minLat: { type: Number, default: null },
        minLon: { type: Number, default: null },
      },
    },
    generalInfo: {
      state: { type: String, default: "" },
      isLargeCity: { type: Boolean, default: false },
      population: { type: Number, default: null },
    },
  },
  lastRefreshedAt: { type: Boolean, default: Date.now },
  isDataBeingFetched : {type: Boolean, default: false}
});

const City = mongoose.model("cities", schema);

module.exports = City;
