const express = require("express");
const router = express.Router();
const Subcategories = require("../models/Subcategory");

// To add a new subcategory lookup
router.post("/:category/:subcategory", async (req, res) => {
  const subcategoryToPost = new Subcategories({
    subcategoryName: req.params.subcategory,
    category: req.params.category,
  });
  Subcategories.findOne({ subcategoryName: req.params.subcategory }).then(
    async (data) => {
      if (data === null) {
        const saveSubcategory = await subcategoryToPost
          .save()
          .then((data) => {
            res.json({ data });
          })
          .catch((err) => res.json({ errorMessage: err }));
      } else {
        res.json({ errorMessage: "Subcategory record already exists" });
      }
    }
  );
});

// get list of all subcategories for a category
router.get("/:category", async (req, res) => {
  const subcategories = await Subcategories.find({
    category: req.params.category,
  })
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// get list of all categories and subcategories
router.get("/", async (req, res) => {
  const subcategories = await Subcategories.find({})
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// delete all subcategories
router.delete("/", async (req, res) => {
  const subcategories = await Subcategories.deleteMany({})
    .then((data) => {
      res.json({ message: "All records deleted" });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});
module.exports = router;
