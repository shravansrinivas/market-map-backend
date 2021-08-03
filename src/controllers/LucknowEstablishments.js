const LucknowEstablishments = require("../models/LucknowEstablishments");

module.exports = {
    getLucknowEstablishments: async (req, res) => {
        await LucknowEstablishments.find({})
            .then((establishments) => {
                res.send(establishments);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    },
};
