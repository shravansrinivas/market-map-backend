const axios = require("axios");

const Establishment = require("../models/Establishment");
const async = require("async");
const LocationAdvisorSchema = require("../models/LocationAdvisorScheme");

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

const sumOfScores = (numbers) => {
  return numbers.reduce(function (prev, cur) {
    return prev + cur.score;
  }, 0);
};
const sumOfElements = (numbers) => {
  return numbers.reduce(
    (totalValue, currentValue) => totalValue + currentValue,
    0
  );
};
const metresToLatLong = (metres) => {
  //  Approximations
  // Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitude) km
  let lat = (1 / 110574) * metres;
  let lon = 1 / (111320 * Math.cos(lat));
  return { lat, lon };
};

const getScoreForAnArea = async (obj) => {
  let { area, categoryArr } = obj;
  let { avgLat, avgLon } = area;

  Promise.all(
    categoryArr.map(async function (category) {
      return getScore({
        avgLat,
        avgLon,
        subcategory: category.subcategory,
        radius: category.radius,
        selected: category.selected,
        disabler: category.disabler,
      }).then(function (result) {
        return result;
      });
    })
  ).then(async function (results) {
    // results is an array of names
    console.log(results);
    return results;
  });

  //  async.map(
  //   categoryArr.map((category) => {
  //     return {
  //       avgLat,
  //       avgLon,
  //       subcategory: category.subcategory,
  //       radius: category.radius,
  //       selected: category.selected,
  //       disabler: category.disabler,
  //     };
  //   }),
  //   getScore,
  //   function (err, res) {
  //     let score = sumOfElements(res);
  //     return score;
  //   }
  // );
};
const getScore = async (obj) => {
  let { avgLat, avgLon, subcategory, radius, selected, disabler } = obj;
  if (selected) {
    let { lat, lon } = metresToLatLong(radius);
    let scoreArr = await Establishment.aggregate([
      {
        $match: {
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
        },
      },
      {
        $count: "id",
      },
    ]);
    let score =
      scoreArr.length === 0
        ? 0
        : disabler
        ? -1 * scoreArr[0]["id"]
        : scoreArr[0]["id"];

    return score;
  } else {
    return 0;
  }
};
// GET ALL ESTABLISHMENTS IN A CITY
module.exports.handleGetAllEstablishmentsInACity = async (req, res) => {
  try {
    let city = req.params.cityName;
    let establishments = await Establishment.aggregate([
      {
        $match: { "address.countrySecondarySubdivision": city },
      },
      {
        $addFields: {
          shopAddress: "$address.freeformAddress",
          name: "$poi.name",
          zip: "$address.postalCode",
          // category: "$poi.classifications.code",
          category: "$poi.categories",
          latitude: "$position.lat",
          longitude: "$position.lon",
        },
      },
      {
        $project: {
          shopAddress: 1,
          name: 1,
          zip: 1,
          category: 1,
          latitude: 1,
          longitude: 1,
          id: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);
    return res.json({ error: false, establishments });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

// add a new shop
module.exports.handlePostEstablishment = async (req, res) => {
  try {
    let API_KEY = process.env.MAPQUEST_API_KEY,
      street = req.body.street,
      zip = req.body.zip,
      state = req.body.state,
      city = req.body.city,
      category = req.body.category,
      radius = 10000;

    let mapquestUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&street=${street}&city=${city}&state=${state}&postalCode=${zip}`;
    axios
      .get(mapquestUrl)

      .then(async (response) => {
        let { data } = response;
        let { lat, lng } = data["results"][0]["locations"][0]["latLng"];
        let diffRadius = metresToLatLong(radius);
        let diff_lat = diffRadius.lat,
          diff_lon = diffRadius.lon;
        let est_to_save = new Establishment({
          type: { type: String, default: "" },
          id: { type: String, default: "" },
          score: { type: Number, default: null },
          dist: { type: Number, default: null },
          info: { type: String, default: "" },
          poi: {
            name: { type: String, default: "" },
            categorySet: [
              {
                id: { type: Number, default: null },
              },
            ],
            categories: [{ type: String, default: "" }],
            classifications: [
              {
                code: { type: String, default: "" },
                names: [
                  {
                    nameLocale: { type: String, default: "" },
                    name: { type: String, default: "" },
                  },
                ],
              },
            ],
          },
          address: {
            streetName: { type: String, default: "" },
            municipalitySubdivision: { type: String, default: "" },
            municipality: { type: String, default: "" },
            countrySecondarySubdivision: { type: String, default: "" },
            countrySubdivision: { type: String, default: "" },
            postalCode: { type: String, default: "" },
            countryCode: { type: String, default: "" },
            country: { type: String, default: "" },
            countryCodeISO3: { type: String, default: "" },
            freeformAddress: { type: String, default: "" },
            localName: { type: String, default: "" },
          },
          position: {
            lat: { type: Number, default: null },
            lon: { type: Number, default: null },
          },
          viewport: {
            topLeftPoint: {
              lat: { type: Number, default: null },
              lon: { type: Number, default: null },
            },
            btmRightPoint: {
              lat: { type: Number, default: null },
              lon: { type: Number, default: null },
            },
          },
          entryPoints: [
            {
              type: { type: String, default: "" },
              position: {
                lat: { type: Number, default: null },
                lon: { type: Number, default: null },
              },
            },
          ],
        });
        return res.json({ error: false, results });
      })
      .catch((err) => {
        return res.json({ error: true, errorMessage: err });
      });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

module.exports.handleGetTopMarketAreasInACity = async (req, res) => {
  try {
    let city = req.params.cityName;
    let topMarketAreas = await topMarketAreasInACity(city);
    return res.json({ error: false, topMarketAreas });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

module.exports.cpyGetLocationAdvisorScore = async (req, res) => {
  try {
    let schema = req.body.schema; // [ { subcategory, radius, selected, disabler}];
    let cityName = req.query.cityName;
    let schemaName = req.body.schemaName;

    let topMarketAreas = await topMarketAreasInACity(cityName);
    topMarketAreas = topMarketAreas.slice(0, 30); //limit to top 30 market areas

    // async.parallel(topMarketAreas.map((area)=>{
    //   return function(marketCb){
    //     async.parallel()
    //     marketCb(null, score);

    //   }
    // }),function(marketErr,marketResults){

    // })
    async.parallel(
      topMarketAreas.map((marketArea) => {
        return function (marketCb) {
          let { avgLat, avgLon } = marketArea;
          async.parallel(
            schema.map((category) => {
              return async function (categoryCb) {
                let score;
                let { disabler, radius, selected, subcategory } = category;
                if (selected) {
                  let { lat, lon } = metresToLatLong(radius);
                  score = await Establishment.count({
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
                  score = disabler ? -1 * score : score;
                  categoryCb(null, { ...area, score });
                } else {
                  categoryCb(null, { ...area, score: 0 });
                }
              };
            }),
            function (catErr, categoryResults) {
              console.log(
                "------------------category results-----------------------------"
              );

              console.log(categoryResults, categoryResults[0]);
              marketCb(null, categoryResults);
            }
          );
        };
      }),
      function (err, marketResults) {
        console.log(marketResults, "marketResults");
      }
    );
    res.json({ topMarketAreas });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

module.exports.getLocationAdvisorScore = async (req, res) => {
  try {
    let schema = req.body.schema; // [ { subcategory, radius, selected, disabler}];
    let cityName = req.query.cityName;
    let schemaName = req.body.schemaName;

    let schemaCategories = [];
    let begPromise = new Promise((resolve, reject) => {
      schema.forEach((category, index, array) => {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.selected) schemaCategories.push(subcategory);
        });
        if (index === array.length - 1) {
          resolve();
        }
      });
    });

    begPromise
      .then(async () => {
        // if no subcategories selected, discard
        if (schemaCategories.length === 0)
          return res.json({
            error: true,
            message:
              "Please select at least one subcategory to get suggestions",
          });
        let topMarketAreas = await topMarketAreasInACity(cityName);
        topMarketAreas = topMarketAreas.slice(0, 50); //limit to top 50 market areas

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
                      let { lat, lon } = metresToLatLong(radius);
                      let score = await Establishment.count({
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
                      scoreArray.push({
                        ...category,
                        score,
                        weight: weight || 1,
                      });
                      scores.push(score);
                    } else {
                      scores.push(score);
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
                marketAreaCb(null, { ...marketArea, scoreArray, areaScore });
              });
            };
          }),
          async function (marketAreasErr, marketAreasResult) {
            /// final logic --- marketAreasResult = result with object having area address, score and category, radius etc.
            if (!marketAreasErr) {
              marketAreasResult.sort(
                (a, b) => parseFloat(b.areaScore) - parseFloat(a.areaScore)
              );
              marketAreasResult = marketAreasResult.slice(0, 15);
              if (marketAreasResult[0].areaScore === 0) {
                return res.json({
                  error: true,
                  message:
                    "Couldn't arrive at any suggestions! Please select more factors/categories to get a result.",
                });
              }
              if (schemaName) {
                let locationAdvisorSchema = new LocationAdvisorSchema({
                  schemaName: schemaName,
                  // idealForBusiness: { type: String, default: "" },

                  subcategories: schema,
                });
                await locationAdvisorSchema.save();
              }
              return res.json({
                error: false,
                marketAreasResult,
                schemaMessage: schemaName
                  ? `Schema saved as ${schemaName}`
                  : null,
              });
            } else {
              return res.json({ error: true, errorMessage: marketAreasErr });
            }
          }
        );
      })
      .catch((err) => {
        return res.json({ error: true, errorMessage: err });
      });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

module.exports.getEstablishmentsAroundAnAddress = async (req, res) => {
  try {
    let API_KEY = process.env.MAPQUEST_API_KEY,
      street = req.body.street,
      zip = req.body.zip,
      state = req.body.state,
      city = req.body.city,
      radius = 10000;

    let mapquestUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&street=${street}&city=${city}&state=${state}&postalCode=${zip}`;
    axios
      .get(mapquestUrl)
      // .then((x) => x.json())
      .then(async (response) => {
        let { data } = response;
        let { lat, lng } = data["results"][0]["locations"][0]["latLng"];
        let diffRadius = metresToLatLong(radius);
        let diff_lat = diffRadius.lat,
          diff_lon = diffRadius.lon;
        let results = await Establishment.find({
          "position.lat": {
            $gte: lat - diff_lat,
            $lte: lat + diff_lat,
          },
          "position.lon": {
            $gte: lng - diff_lon,
            $lte: lng + diff_lon,
          },
        });
        return res.json({ error: false, results });
      })
      .catch((err) => {
        return res.json({ error: true, errorMessage: err });
      });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
