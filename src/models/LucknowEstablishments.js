const mongoose = require("mongoose");

const lucknowSchema = new mongoose.Schema({
    type: { type: String, default: "" },
    id: { type: String, default: "" },
    score: { type: Number, default: null },
    dist: { type: Number, default: null },
    info: { type: String, default: "" },
    poi: {
        name: { type: String, default: "" },
        categorySet: [
            {
                id: { type: Number, default: null },
            },
        ],
        categories: [{ type: String, default: "" }],
        classifications: [
            {
                code: { type: String, default: "" },
                names: [
                    {
                        nameLocale: { type: String, default: "" },
                        name: { type: String, default: "" },
                    },
                ],
            },
        ],
    },
    address: {
        streetName: { type: String, default: "" },
        municipalitySubdivision: { type: String, default: "" },
        municipality: { type: String, default: "" },
        countrySecondarySubdivision: { type: String, default: "" },
        countrySubdivision: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        countryCode: { type: String, default: "" },
        country: { type: String, default: "" },
        countryCodeISO3: { type: String, default: "" },
        freeformAddress: { type: String, default: "" },
        localName: { type: String, default: "" },
    },
    position: {
        lat: { type: Number, default: null },
        lon: { type: Number, default: null },
    },
    viewport: {
        topLeftPoint: {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null },
        },
        btmRightPoint: {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null },
        },
    },
    entryPoints: [
        {
            type: { type: String, default: "" },
            position: {
                lat: { type: Number, default: null },
                lon: { type: Number, default: null },
            },
        },
    ],
});

const Lucknow = mongoose.model("Lucknow", lucknowSchema);

module.exports = Lucknow;
