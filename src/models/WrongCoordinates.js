const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    city: { type: String },
    wrongCoordinates: [
        {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null },
        },
    ],
    // Name of the city which has the above coordinates
    correctCity: { type: String, default: null },
});

const WrongCoordinate = mongoose.model("WrongCoordinate", schema);

module.exports = WrongCoordinate;
