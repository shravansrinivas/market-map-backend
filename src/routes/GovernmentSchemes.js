const express = require("express");
const router = express.Router();
const GovernmentSchemes = require("../models/GovernmentSchemes");

router.get(``, async (req, res) => {
    try {
        let governmentSchemes = await GovernmentSchemes.find({});
        res.json(governmentSchemes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
