const MuzaffarpurEstablishment = require("../models/MuzaffarpurEstablishments");

module.exports = {
    getMuzaffarpurEstablishments: async (req, res) => {
        await MuzaffarpurEstablishment.find({})
            .then((establishments) => {
                res.send(establishments);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    },
};
