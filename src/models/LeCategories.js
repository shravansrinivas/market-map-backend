const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  category: { type: String },
  subcategory: [{ type: String }],
});

const LeCategories = mongoose.model("le_categories", schema);

module.exports = LeCategories;
