const express = require("express");
const router = express.Router();
const Shops = require("../models/Shop");
const axios = require("axios");
var dotenv = require("dotenv").config({ path: __dirname + "/../.env" });
const { default: Axios } = require("axios");
const Cities = require("../models/City");
// Post a new shop record
router.post("/:cityName/:category/:subcategory", async (req, res) => {
  Shops.findOne({
    shopName: req.body.shopName, //category: req.params.category,
    //subcategory: req.params.subcategory,
    cityName: req.params.cityName,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  }).then(async (data) => {
    if (data == null) {
      const shopToSave = new Shops({
        shopName: req.body.shopName,
        category: req.params.category,
        subcategory: req.params.subcategory,
        cityName: req.params.cityName,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      });

      const saveShop = shopToSave
        .save()
        .then((data) => {
          res.json({ data });
        })
        .catch((err) => {
          res.json({ errorMessage: err });
        });
    } else {
      res.json({ message: "Shop record already exists" });
    }
  });
});

router.post("/byUser/:cityName/:category/:subcategory", async (req, res) => {
  let latitude, longitude;
  await axios
    .get(
      `${process.env.MAPQUEST_API_BASE}${process.env.MAPQUEST_API_KEY}&location=${req.body.address}`
    )
    .then(async (response) => {
      latitude = response.data.results[0]["locations"][0]["latLng"]["lat"];
      longitude = response.data.results[0]["locations"][0]["latLng"]["lng"];
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
  Shops.findOne({
    shopName: req.body.shopName,
    //category: req.params.category,
    //subcategory: req.params.subcategory,
    cityName: req.params.cityName,
    address: req.body.address,
    latitude: latitude,
    longitude: longitude,
  }).then(async (data) => {
    if (data == null) {
      const shopToSave = new Shops({
        shopName: req.body.shopName,
        category: req.params.category,
        subcategory: req.params.subcategory,
        cityName: req.params.cityName,
        address: req.body.address,
        latitude: latitude,
        longitude: longitude,
      });

      const saveShop = await shopToSave
        .save()
        .then((data) => {
          res.json({ data });
        })
        .catch((err) => {
          res.json({ errorMessage: err });
        });
    } else {
      res.json({ message: "Shop record already exists" });
    }
  });
});
router.post("/v2/byUser/:cityName/:category/:subcategory", async (req, res) => {
  let latitude, longitude;
  let state = "";
  await Cities.findOne({ cityName: req.params.cityName }).then((data) => {
    state = data.state;
  });
  await axios
    .get(
      `${process.env.MAPQUEST_API_BASE}${process.env.MAPQUEST_API_KEY}&street=${req.body.streetName}&city=${req.params.cityName}&state=${state}&postalCode=${req.body.zip}&adminArea1=IN`
    )
    .then(async (response) => {
      latitude = response.data.results[0]["locations"][0]["latLng"]["lat"];
      longitude = response.data.results[0]["locations"][0]["latLng"]["lng"];
    })
    .then(() => {
      Shops.findOne({
        shopName: req.body.shopName,
        //category: req.params.category,
        //subcategory: req.params.subcategory,
        cityName: req.params.cityName,
        address: `${req.body.streetName},${req.params.cityName},${state},${req.body.zip}`,
        latitude: latitude,
        longitude: longitude,
      }).then(async (data) => {
        if (data == null) {
          const shopToSave = new Shops({
            shopName: req.body.shopName,
            category: req.params.category,
            subcategory: req.params.subcategory,
            cityName: req.params.cityName,
            address: `${req.body.streetName},${req.params.cityName},${state},${req.body.zip}`,
            latitude: latitude,
            longitude: longitude,
          });

          const saveShop = await shopToSave
            .save()
            .then((data) => {
              res.json({ data });
            })
            .catch((err) => {
              res.json({ errorMessage: err });
            });
        } else {
          res.json({ message: "Shop record already exists" });
        }
      });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Get all shops in a city
router.get("/:cityName", async (req, res) => {
  const shops = Shops.find({ cityName: req.params.cityName })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Get all shops in a city of a particular category
router.get("/:cityName/byCategory", async (req, res) => {
  const shops = Shops.find({
    cityName: req.params.cityName,
    category: req.query.category,
  })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});
// Get all shops in a city of a particular category
router.put("/:cityName/byCategories", async (req, res) => {
  let filter = {
    cityName: req.params.cityName,
  };
  if (req.body.categories !== undefined || req.body.categories) {
    filter["category"] = { $in: req.body.categories };
  }
  const shops = Shops.find(filter)
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Get all shops in a city of a particular subcategory
router.get("/:cityName/bySubcategory", async (req, res) => {
  const shops = Shops.find({
    cityName: req.params.cityName,
    subcategory: req.query.subcategory,
  })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Get all shops in a city at a particular address
router.get("/:cityName/byAddress", async (req, res) => {
  if (req.body.list === undefined) {
    const shops = Shops.find({
      cityName: req.params.cityName,
      address: req.query.address,
    })
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        res.json({ errorMessage: err });
      });
  } else {
    const shops = Shops.find({
      cityName: req.params.cityName,
      address: req.query.address,
      subcategory: { $in: req.body.list },
    })
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        res.json({ errorMessage: err });
      });
  }
});

// // Major market areas in a city
// router.get("/:cityName/majorMarketAreas", async (req, res) => {
//   const majormarketareas = await Shops.find({ cityName: req.params.cityName })
//     .then(async (data) => {
//       console.log(data);
//       let result = await getMajorMarketAreas(data);

//       res.json({ data: result });
//     })
//     .catch((err) => {
//       res.json({ errorMessage: err });
//     });
// });

// Delete by shop name -- for testing
router.delete("/:city/oneshop", async (req, res) => {
  const shops = await Shops.deleteOne({
    shopName: req.body.shopName,
    cityName: req.params.city,
  })
    .then((data) => res.json({ message: "Shop record deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

router.delete("/:city/many", async (req, res) => {
  const shops = await Shops.deleteMany({
    shopName: req.body.shopName,
    cityName: req.params.city,
  })
    .then((data) => res.json({ message: "Shop record deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Delete all records
router.delete("/", async (req, res) => {
  const shops = await Shops.deleteMany({})
    .then((data) => res.json({ message: "All records deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Delete all records in a city
router.delete("/:cityName", async (req, res) => {
  const shops = await Shops.deleteMany({ cityName: req.params.cityName })
    .then((data) => res.json({ message: "All records deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Delete all records in a city of a subcategory
router.delete("/:cityName/:subcategory", async (req, res) => {
  const shops = await Shops.deleteMany({
    cityName: req.params.cityName,
    subcategory: req.params.subcategory,
  })
    .then((data) => res.json({ message: "All records deleted" }))
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});
module.exports = router;
