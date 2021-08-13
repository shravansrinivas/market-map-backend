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
                // convert coordinates to only 5 decimal places
                avgLat: { $avg: "$position.lat" },
                avgLon: { $avg: "$position.lon" },
            },
        },
        {
            $match: { shopCounts: { $gte: 1 } },
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
        let schema = req.body.schema; // [ { subcategory, radius, selected, disabler, index, weigt}];
        let schemaName = req.body.schemaName;

        console.log(`City Name is ${cityName}`);
        // console.log(`Schema is`, schema);
        // for (let sch of schema) {
        //     console.log(sch.subcategories);
        // }
        console.log(`Schema Name is ${schemaName}`);

        // Returns an array of categories which has been selected by the user
        const setSchemaCategories = () => {
            let begPromise = new Promise((resolve, reject) => {
                let schemaCategories = [];
                schema.forEach((category, index, array) => {
                    category.subcategories.forEach((subcategory) => {
                        if (subcategory.selected)
                            schemaCategories.push(subcategory);
                    });
                    if (index === array.length - 1) {
                        resolve(schemaCategories);
                    }
                });
            });
            return begPromise;
        };

        const schemaCategories = await setSchemaCategories();
        console.log(`Schema Categories are `, schemaCategories);

        if (schemaCategories.length === 0) {
            return res.json({
                error: true,
                message:
                    "Please select at least one subcategory to get suggestions",
            });
        }

        let topMarketAreas = await topMarketAreasInACity(cityName);
        console.log(`Top market areas are`, topMarketAreas);
        console.log(`Top market areas size is ${topMarketAreas.length}`);

        const marketAreasResult = [];

        for (const marketArea of topMarketAreas) {
            // const marketArea = topMarketAreas[0];
            let { avgLat, avgLon } = marketArea;
            let scoreArray = [];
            let scores = [];

            for (const category of schemaCategories) {
                let { radius, subcategory, disabler, weight } = category;
                let { lat, lon } = metresToLatLong(radius);
                let score = await Establishment.countDocuments({
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
                score = (disabler ? -1 * score : score) * (weight || 1);
                console.log(`For category ${subcategory}, score is $ ${score}`);

                scoreArray.push({
                    ...category,
                    score,
                    weight: weight || 1,
                });
                scores.push(score);
            }

            console.log(`Score array is `, scoreArray);
            console.log(`Scores are `, scores);

            let areaScore = sumOfElements(scores);
            const enablersPlusDisablers = totalEnablersAndDisablers(scores);
            if (enablersPlusDisablers != 0) {
                areaScore = (areaScore / enablersPlusDisablers) * 10;
            }
            console.log(`${marketArea._id} score is ${areaScore}`);

            // adding this to the final result
            marketAreasResult.push({ ...marketArea, scoreArray, areaScore });
        }

        marketAreasResult.sort(
            (a, b) => parseFloat(b.areaScore) - parseFloat(a.areaScore)
        );
        console.log(`Market Areas result is : `, marketAreasResult);

        // keeping only the top 15 market areas
        marketAreasResult.slice(0, 15);

        console.log(`Sorted Market Areas result is : `, marketAreasResult);

        if (marketAreasResult[0].areaScore === 0) {
            return res.json({
                error: true,
                // No good market areas
                message:
                    "Couldn't arrive at any suggestions! Please select more factors/categories to get a result.",
            });
        }

        if (schemaName) {
            let locationAdvisorSchema = new LocationAdvisorSchema({
                schemaName: schemaName,
                subcategories: schema,
            });
            await locationAdvisorSchema.save();
        }

        return res.json({
            error: false,
            marketAreasResult,
            schemaMessage: schemaName ? `Schema saved as ${schemaName}` : null,
        });

        // return res.json({
        //     error: true,
        //     errorMessage: `Not an actual error`,
        // });
    } catch (err) {
        console.log(err);
        return res.json({ error: true, errorMessage: err });
    }
};
