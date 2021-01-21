const mongoose = require("mongoose");

const ShopSchema = mongoose.Schema({
  shopName: String,
  category: String,
  subcategory: String,
  cityName: { type: String, index: true },
  address: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model("Shops", ShopSchema);
