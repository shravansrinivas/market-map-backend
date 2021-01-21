const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  cityName: { type: String, index: true },
  latitude: {type:Number, required: true},
  longitude: {type:Number, required: true},
  state: {type:String, required: true},
  isLargeCity: {type:Boolean, required: true},
  locList: [{latitude: Number, longitude: Number}]
});

module.exports = mongoose.model("Cities", CitySchema);
