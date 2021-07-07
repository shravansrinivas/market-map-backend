const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
    Name: { type: String },
    "Licenses Required": { type: String },
    "Central/State/ Local": { type: String },
    "Name Of the State": { type: String },
    "Online Procedure": { type: String },
    "Offline Procedure": { type: String },
    "Office Address for Offline Procedure": { type: String },
    "Document Required": { type: String },
    Links: { type: String },
    Contact: { type: String },
    Cost: { type: String },
    Renwal: { type: String },
    "Time taken": { type: String },
    Source: { type: String },
    Resources: { type: String },
});

const License = mongoose.model("LicenseNew", licenseSchema);

module.exports = License;
