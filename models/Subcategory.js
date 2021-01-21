const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  subcategoryName: { type: String, index: true },
  category: { type: String, index: true },
});

module.exports = mongoose.model("Subcategories", CitySchema);
