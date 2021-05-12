const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    "Idea":{ type: String },
    "SNo":{ type: String },
    "Licenses Requires":{ type: String },
    "Central/State/Local":{ type: String },
     "State":{ type: String },
     "OnlineProcedure":{ type: String },
     "OfflineProcedure":{ type: String },
     "OfficeAddressforOfflineProcedure":{ type: String },
     "DocumentRequired":{ type: String },
     "Contact":{ type: String },
     "Renewal":{ type: String },
     "TimeTaken":{ type: String },
     "Resources(You Tube Links)":{ type: String },
     "Cost":{ type: String },
     "Links":{ type: String },
});
schema.set('collection', 'licenses');
const RequiredLicenses = mongoose.model('licenses', schema);
													

module.exports = RequiredLicenses;