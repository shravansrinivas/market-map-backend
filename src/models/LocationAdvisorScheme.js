const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  schemaName: { type: String },
  idealForBusiness: {type: String},
  subcategories: [
    {
      subcategory: { type: String },
      radius: { type: Number, default: 500 },
      diabler: { type: Boolean, default: false },
      selected: { type: Boolean, default: false },
    },
  ],
});

const LocationAdvisorSchema = mongoose.model(
  "le_location_advisor_schemes",
  schema
);

module.exports = LocationAdvisorSchema;
