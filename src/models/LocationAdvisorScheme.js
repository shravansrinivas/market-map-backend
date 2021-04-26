const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  schemaName: { type: String },
  idealForBusiness: { type: String, default: "" },

  subcategories: [
    {
      category: { type: String },
      subcategories: [
        {
          subcategory: { type: String },
          disabler: { type: Boolean, default: false },
          selected: { type: Boolean, default: false },
          radius: { type: Number, default: 500 },
          weight: { type: Number, default: 1 },
        },
      ],
    },
  ],
});

const LocationAdvisorSchema = mongoose.model(
  "le_location_advisor_schemes",
  schema
);

module.exports = LocationAdvisorSchema;
