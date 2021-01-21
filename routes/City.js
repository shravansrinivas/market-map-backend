const express = require("express");
const Cities = require("../models/City");
const router = express.Router();
const cities = require("../cities.json");

// To add details of particular city
router.post("/:cityName", async (req, res) => {
  const largeCities = {
    Agra: [
      { latitude: 27.217914, longitude: 78.030227 },
      { latitude: 27.207698, longitude: 77.927353 },
      { latitude: 27.174194, longitude: 77.968418 },
      { latitude: 27.14953, longitude: 78.015853 },
      { latitude: 27.196465, longitude: 78.015444 },
    ],
    Mathura: [
      { latitude: 27.502676, longitude: 77.666314 },
      { latitude: 27.483168, longitude: 77.693432 },
      { latitude: 27.45507, longitude: 77.70547 },
    ],
    Allahabad: [
      { latitude: 25.363623, longitude: 81.844798 },
      { latitude: 25.437423, longitude: 81.860714 },
      { latitude: 25.374778, longitude: 81.853055 },
    ],
    Lucknow: [
      { latitude: 25.374778, longitude: 81.853055 },
      { latitude: 26.904771, longitude: 80.931695 },
      { latitude: 26.806293, longitude: 80.928044 },
      { latitude: 26.845427, longitude: 80.976656 },
    ],
    "Rae Barieli": [
      { latitude: 26.253644, longitude: 81.248053 },
      { latitude: 26.241638, longitude: 81.225902 },
      { latitude: 26.219303, longitude: 81.259713 },
      { latitude: 26.220543, longitude: 81.231563 },
    ],
    Patna: [
      { latitude: 27.085914, longitude: 81.239752 },
      { latitude: 27.083087, longitude: 81.23237 },
      { latitude: 27.078196, longitude: 81.227692 },
      { latitude: 27.073802, longitude: 81.229452 },
      { latitude: 27.079151, longitude: 81.239666 },
      { latitude: 27.073037, longitude: 81.240008 },
      { latitude: 27.069712, longitude: 81.243484 },
    ],
    Hyderabad: [
      { latitude: 17.360306, longitude: 78.562549 },
      { latitude: 17.281701, longitude: 78.424471 },
      { latitude: 17.366863, longitude: 78.561184 },
      { latitude: 17.367612, longitude: 78.49317 },
      { latitude: 17.330339, longitude: 78.414852 },
      { latitude: 17.398489, longitude: 78.411468 },
      { latitude: 17.47319, longitude: 78.406033 },
      { latitude: 17.4693, longitude: 78.295433 },
      { latitude: 17.530894, longitude: 78.252842 },
      { latitude: 17.538089, longitude: 78.350421 },
      { latitude: 17.555092, longitude: 78.428102 },
    ],
    Ranchi: [
      { latitude: 23.39516, longitude: 85.373573 },
      { latitude: 23.392041, longitude: 85.30624 },
      { latitude: 23.38669, longitude: 85.247164 },
      { latitude: 23.351383, longitude: 85.275663 },
      { latitude: 23.294006, longitude: 85.297276 },
      { latitude: 23.336858, longitude: 85.342268 },
    ],
    Bhubaneshwar: [
      { latitude: 20.351407, longitude: 85.835247 },
      { latitude: 20.315654, longitude: 85.852054 },
      { latitude: 20.273153, longitude: 85.840696 },
      { latitude: 20.259005, longitude: 85.791945 },
      { latitude: 20.311167, longitude: 85.799855 },
    ],
  };
  if (cities[req.params.cityName.toLowerCase()] !== undefined) {
    const city = await Cities.findOne({ cityName: req.params.cityName }).then(
      async (data) => {
        if (data === null) {
          if (Object.keys(largeCities).indexOf(req.params.cityName) === -1) {
            const cityToAdd = new Cities({
              cityName: req.params.cityName,
              state: req.body.state,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              isLargeCity: false,
              locList: [],
            });
            const saveCity = await cityToAdd
              .save()
              .then((data) => {
                res.json(data);
              })
              .catch((err) => {
                res.send({ errorMessage: err });
              });
          } else {
            const cityToAdd = new Cities({
              cityName: req.params.cityName,
              state: req.body.state,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              isLargeCity: true,
              locList: largeCities[req.params.cityName],
            });
            const saveCity = await cityToAdd
              .save()
              .then((data) => {
                res.json(data);
              })
              .catch((err) => {
                res.send({ errorMessage: err });
              });
          }
        } else {
          res.json({ message: "City record already exists" });
        }
      }
    );
  } else {
    res.json({ message: "Invalid city name" });
  }
});

// To get details of particular City
router.get("/:cityName", async (req, res) => {
  const city = await Cities.findOne({ cityName: req.params.cityName })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// To get list of all cities from DB
router.get("/", async (req, res) => {
  const citiesInDB = await Cities.find()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// delete all cities
router.delete("/", async (req, res) => {
  const cities = Cities.deleteMany({})
    .then((data) => res.json({ message: "All records deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});
module.exports = router;
