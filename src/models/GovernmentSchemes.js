const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema({
    Name: { type: String },
    "Central/State": { type: String },
    "Name Of the State": { type: String },
    "Name Of the Scheme": { type: String },
    "Details of Scheme": { type: String },
    "Application Procedure": { type: String },
    Documentation: { type: String },
    "Authority Contacted": { type: String },
    "Contact Number Of the Government Authority": { type: String },
    Link: { type: String },
    Eligibility: { type: String },
});

const GovernmentScheme = mongoose.model(
    "GovernmentScheme",
    governmentSchemeSchema
);

module.exports = GovernmentScheme;
