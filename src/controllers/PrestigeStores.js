const PrestigeStore = require("../models/PrestigeStores");

// GET ALL Prestige stores
module.exports.handleGetAllPrestigeStores = async (req, res) => {
  try {
    let stores = await PrestigeStore.find();
    return res.json({ error: false, stores });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

// GET ALL Prestige stores by state
module.exports.handleGetPrestigeStoresByState = async (req, res) => {
  try {
    let stores = await PrestigeStore.find({ state: req.params.state });
    return res.json({ error: false, stores });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
