const mongoose = require("mongoose");

const schema = new mongoose.Schema({
 "SNo": { type: Number },
 "City": { type: String },
 "Shop/Office/ Godown/Plot": { type: String },
  "address": { type: String },
  "Super Area (Sq ft)": { type: Number },
  "Floor (Ground,1st,2nd 3rd)": { type: String },
  "Facilities": { type: String },
  "Furnished/Unfurnished": { type: String },
  "Rent": { type: Number },
  "Deposit": { type: Number },
  "Price/Sq ft":{ type: Number },
  "Carpet Area (Sq ft)":{ type: String },
  "Latitude": { type: Number },
  "Longitude": { type: Number },
  "Tag": { type: String },
});
schema.set('collection',"rentLocations")
const RentLocation = mongoose.model("rentLocations", schema);

module.exports = RentLocation;
