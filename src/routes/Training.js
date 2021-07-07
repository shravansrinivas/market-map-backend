const express = require("express");
const router = express.Router();
const Training = require("../models/Training");

router.get(``, async (req, res) => {
    try {
        let training = await Training.find({});
        res.json(training);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
