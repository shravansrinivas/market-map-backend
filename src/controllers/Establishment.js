const Establishment = require("../models/Establishment");
const async = require("async");

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
  
  Promise.all(categoryArr.map(async function(category) { 
    return getScore({
            avgLat,
            avgLon,
            subcategory: category.subcategory,
            radius: category.radius,
            selected: category.selected,
            disabler: category.disabler,
          }).then(function(result) { 
        return result;
    });
})).then(async function(results) {
    // results is an array of names
    console.log(results)
    return results;
})

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

module.exports.handleGetTopMarketAreasInACity = async (req, res) => {
  try {
    let city = req.params.cityName;
    let topMarketAreas = await topMarketAreasInACity(city);
    return res.json({ error: false, topMarketAreas });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

module.exports.getLocationAdvisorScore = async (req, res) => {
  try {
    let schema = req.body.schema; // [ { subcategory, radius, selected, disabler}];
    let cityName = req.query.cityName;
    let schemaName = req.body.schemaName;

    let topMarketAreas = await topMarketAreasInACity(cityName);
    topMarketAreas = topMarketAreas.slice(0, 30); //limit to top 30 market areas

    async.map(
      topMarketAreas.map((marketArea) => {
        return { area: marketArea, categoryArr: schema };
      }),
      getScoreForAnArea,
      function (err, results) {
        console.log(results,'final result');
      }
    );
    // async.parallel(
    //   topMarketAreas.map( (marketArea) => {
    //     return async function (cb) {
    //       let score = await getScoreForAnArea({
    //         area: marketArea,
    //         categoryArr: schema,
    //       });
    //       cb(null, score);
    //     };
    //   }),
    //   function (err, resp) {
    //       console.log(resp);
    //   }
    // );
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
