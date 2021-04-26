const {
  handleGetAllPrestigeStores,
  handleGetPrestigeStoresByState,
} = require("../controllers/PrestigeStores");

const router = require("express").Router();

// get all prestige stores
router.get(``, handleGetAllPrestigeStores);

// get all prestige stores in state
router.get(`/:state`, handleGetPrestigeStoresByState);
module.exports = router;
