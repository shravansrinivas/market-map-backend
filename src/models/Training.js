const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
    Name: { type: String },
    "Organization Conducting the training": { type: String },
    "Central/State": { type: String },
    "Name of the Program": { type: String },
    Duration: { type: String },
    Curriculum: { type: String },
    Eligibility: { type: String },
    "Cost Of Training": { type: String },
    "Type Of Training (Digital/In-person)": { type: String },
    Contact: { type: String },
    "Digital/Physical": { type: String },
    "Application Form": { type: String },
    "Application Process": { type: String },
    Link: { type: String },
    "Financial Assistance": { type: String },
});

const Training = mongoose.model("newTraining", trainingSchema);

module.exports = Training;
