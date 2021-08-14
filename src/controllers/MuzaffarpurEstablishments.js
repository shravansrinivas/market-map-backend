const MuzaffarpurEstablishment = require("../models/MuzaffarpurEstablishments");

module.exports = {
    getMuzaffarpurEstablishments: async (req, res) => {
        // await MuzaffarpurEstablishment.find({})
        //     .then((establishments) => {
        //         const resultArray = [];
        //         for (const est of establishments) {
        //             const { poi, address, position } = est;
        //             const { name, categories } = poi;
        //             resultArray.push({
        //                 poi: { name, categories },
        //                 address,
        //                 position,
        //             });
        //         }
        //         res.send(resultArray);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         res.send(err);
        //     });

        try {
            let establishments = await MuzaffarpurEstablishment.aggregate([
                {
                    $group: {
                        _id: "$id",
                        poi: { $first: "$poi" },
                        address: { $first: "$address" },
                        position: { $first: "$position" },
                    },
                },
                {
                    $project: {
                        "poi.categorySet": 0,
                        "poi.classifications": 0,
                        _id: 0,
                    },
                },
            ]);

            res.json({ error: false, establishments });
        } catch (err) {
            res.json({ error: true, error: err });
        }
    },
};
