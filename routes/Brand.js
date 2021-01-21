const express = require("express");
const Brands = require("../models/Brand");
const router = express.Router();

// Add a brand
router.post(`/:brandName`, async (req, res) => {
  const brand = await Brands.findOne({ cityName: req.params.cityName }).then(
    async (data) => {
      if (data === null) {
        const brandToAdd = new Brands({
          brand: req.params.brandName,
          brandCategory: req.body.brandCategory,
        });

        const saveBrand = await brandToAdd
          .save()
          .then((data) => {
            res.json(data);
          })
          .catch((err) => {
            res.send({ errorMessage: err });
          });
      } else {
        res.json({ message: "Brand record already exists" });
      }
    }
  );
});

// get list of brands
router.get(`/`, async (req, res) => {
  const brandsToFetch = await Brands.find({})
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

//Delete a brand
router.delete(`/:brandName`, async (req, res) => {
  const brandToDelete = await Brands.deleteOne({
    brand: req.params.brandName,
  }).then((data) => {
    res.json({ message: "Brand deleted" });
  });
});

module.exports = router;
