const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema({
  brandCategory: { type: String, index: true },
  brand: { type: String, index: true },
});

module.exports = mongoose.model("Brands", BrandSchema);
