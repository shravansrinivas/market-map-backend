const Establishment = require("../models/Establishment");

// helper functions
const topMarketAreasInACity = async (city) => {
    let topMarketAreas = await Establishment.aggregate([
        {
            $match: { "address.countrySecondarySubdivision": city },
        },
        {
            $group: {
                _id: "$address.freeformAddress",
                shopCounts: { $sum: 1 },
                avgLat: { $avg: "$position.lat" },
                avgLon: { $avg: "$position.lon" },
            },
        },
        {
            $match: { shopCounts: { $gte: 10 } },
        },
        {
            $sort: { shopCounts: -1 },
        },
    ]);
    return topMarketAreas;
};

const metresToLatLong = (metres) => {
    //  Approximations
    // Latitude: 1 deg = 110.574 km
    // Longitude: 1 deg = 111.320*cos(latitude) km
    let lat = (1 / 110574) * metres;
    let lon = 1 / (111320 * Math.cos(lat));
    return { lat, lon };
};

const sumOfElements = (numbers) => {
    return numbers.reduce(
        (totalValue, currentValue) => totalValue + currentValue,
        0
    );
};

const totalEnablersAndDisablers = (scores) => {
    let total = 0;
    for (let score of scores) {
        score = score < 0 ? -1 * score : score;
        total += score;
    }
    return total;
};

// New location advisor algo
module.exports.newLocationAdvisor = async (req, res) => {
    try {
        let cityName = req.query.cityName;
        let schema = req.body.schema; // [ { subcategory, radius, selected, disabler}];
        let schemaName = req.body.schemaName;

        console.log(`City Name is ${cityName}`);
        console.log(`Schema is`, schema);
        // for (let sch of schema) {
        //     console.log(sch.subcategories);
        // }
        console.log(`Schema Name is ${schemaName}`);

        let schemaCategories = [];
        let begPromise = new Promise((resolve, reject) => {
            schema.forEach((category, index, array) => {
                category.subcategories.forEach((subcategory) => {
                    if (subcategory.selected)
                        schemaCategories.push(subcategory);
                });
                if (index === array.length - 1) {
                    resolve();
                }
            });
        });

        begPromise
            .then(async () => {
                // if no subcategories selected, discard
                if (schemaCategories.length === 0) {
                    return res.json({
                        error: true,
                        message:
                            "Please select at least one subcategory to get suggestions",
                    });
                }

                console.log(schemaCategories);
                let topMarketAreas = await topMarketAreasInACity(cityName);
                // console.log(`Top market areas are`, topMarketAreas);
                // console.log(
                //     `Top market areas size is ${topMarketAreas.length}`
                // );

                async.parallel(
                    // iterate each marketArea
                    topMarketAreas.map((marketArea) => {
                        return function (marketAreaCb) {
                            let { avgLat, avgLon } = marketArea;
                            let scoreArray = [];
                            let scores = [];
                            let prom = new Promise((resolve, reject) => {
                                schemaCategories.forEach(
                                    async (category, index, categories) => {
                                        // calculate category score for this market
                                        let {
                                            selected,
                                            radius,
                                            subcategory,
                                            disabler,
                                            weight,
                                        } = category;
                                        if (selected) {
                                            let { lat, lon } =
                                                metresToLatLong(radius);
                                            let score =
                                                await Establishment.count({
                                                    "position.lat": {
                                                        $gte: avgLat - lat,
                                                        $lte: avgLat + lat,
                                                    },
                                                    "position.lon": {
                                                        $gte: avgLon - lon,
                                                        $lte: avgLon + lon,
                                                    },
                                                    "poi.categories": {
                                                        $in: [subcategory],
                                                    },
                                                });
                                            score =
                                                (disabler
                                                    ? -1 * score
                                                    : score) * (weight || 1);
                                            scoreArray.push({
                                                ...category,
                                                score,
                                                weight: weight || 1,
                                            });
                                            scores.push(score);
                                        } else {
                                            // changed from original
                                            scores.push(0);
                                            scoreArray.push({
                                                ...category,
                                                score: 0,
                                                weight: weight || 1,
                                            });
                                        }
                                        if (index === categories.length - 1) {
                                            resolve();
                                        }
                                    }
                                );
                            });
                            prom.then(() => {
                                areaScore = sumOfElements(scores);
                                const enablersPlusDisablers =
                                    totalEnablersAndDisablers(scores);
                                areaScore =
                                    (areaScore / enablersPlusDisablers) * 10;
                                console.log(
                                    `${marketArea._id} score is ${areaScore}`
                                );
                                marketAreaCb(null, {
                                    ...marketArea,
                                    scoreArray,
                                    areaScore,
                                });
                            });
                        };
                    }),
                    async function (marketAreasErr, marketAreasResult) {
                        /// final logic --- marketAreasResult = result with object having area address, score and category, radius etc.
                        if (!marketAreasErr) {
                            marketAreasResult.sort(
                                (a, b) =>
                                    parseFloat(b.areaScore) -
                                    parseFloat(a.areaScore)
                            );
                            marketAreasResult = marketAreasResult.slice(0, 15);
                            if (marketAreasResult[0].areaScore === 0) {
                                return res.json({
                                    error: true,
                                    message:
                                        "Couldn't arrive at any suggestions! Please select more factors/categories to get a result.",
                                });
                            }
                            // if (schemaName) {
                            //     let locationAdvisorSchema =
                            //         new LocationAdvisorSchema({
                            //             schemaName: schemaName,
                            //             // idealForBusiness: { type: String, default: "" },

                            //             subcategories: schema,
                            //         });
                            //     await locationAdvisorSchema.save();
                            // }

                            console.log(
                                `Market area result is ${marketAreasResult}`
                            );
                            return res.json({
                                error: false,
                                marketAreasResult,
                                schemaMessage: schemaName
                                    ? `Schema saved as ${schemaName}`
                                    : null,
                            });
                        } else {
                            return res.json({
                                error: true,
                                errorMessage: marketAreasErr,
                            });
                        }
                    }
                );
            })
            .catch((err) => {
                return res.json({ error: true, errorMessage: err });
            });

        // return res.json({ error: true, errorMessage: `Not an actual error` });
    } catch (err) {
        console.log(err);
        return res.json({ error: true, errorMessage: err });
    }
};
