const MuzaffarpurEstablishment = require("../models/MuzaffarpurEstablishments");

module.exports = {
    getMuzaffarpurEstablishments: async (req, res) => {
        await MuzaffarpurEstablishment.find({})
            .then((establishments) => {
                const resultArray = [];
                for (const est of establishments) {
                    const { poi, address, position } = est;
                    const { name, categories } = poi;
                    resultArray.push({
                        poi: { name, categories },
                        address,
                        position,
                    });
                }
                res.send(resultArray);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    },
};
