const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  franchiseName: { type: String },
  noOfPSK: { type: String },
  storeMonth: { type: Number },
  salesStatus: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  lat: { type: Number },
  long: { type: Number },
  locRemark: { type: String },
});

const PrestigeStoreSchema = mongoose.model("prestige_stores", schema);

module.exports = PrestigeStoreSchema;
