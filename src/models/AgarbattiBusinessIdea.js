const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    "Idea":{ type: String },
    "Sno":{ type: String },
    "Organization Conducting the training":{ type: String },
    "Central/State":{ type: String },
    "Name of the Program":{ type: String },
     "Curriculum":{ type: String },
     "Duration":{ type: String },
     "Eligibility":{ type: String },
     "Contact":{ type: String },
     "Digital/Physical":{ type: String },
     "Application Form":{ type: String },
     "Financial  Assistance":{ type: String },
     "Cost":{ type: String },
     "Links":{ type: String },
});
schema.set('collection', 'trainings');
const AgarbattiBusinessIdea = mongoose.model('trainings', schema);

module.exports = AgarbattiBusinessIdea;