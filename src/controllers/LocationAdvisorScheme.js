const LocationAdvisorSchemes = require("../models/LocationAdvisorScheme");

// get all subcategories in displayable form
module.exports.getAllLocationAdvisorSchemes = async (req, res) => {
  try {
    let laSchemes = await LocationAdvisorSchemes.find();
    res.json({ error: false, laSchemes });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
