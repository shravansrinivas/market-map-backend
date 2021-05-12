const {
  handleGetAllRentLocations,
  handleGetAllRentLocationsbyCity,
} = require("../controllers/RentLocation");

const router = require("express").Router();

// get all rent locations
router.get(``, handleGetAllRentLocations);

// get all rent locations in a city
router.get(`/:city`, handleGetAllRentLocationsbyCity);
module.exports = router;

/*const express = require('express');
const router = express.Router();
const RentLocation = require('../models/RentLocation');

router.get('/', async (req,res) => {
    //res.send("HELLO WORLD");
    try{
      var sellers = await RentLocation.find();
      console.log(sellers);
      res.json(sellers);
    }catch(err){
          res.status(500).json({message: err.message});
    }
    
  });

router.get('/:cityName', async (req,res) => {
  //res.send("HELLO WORLD");
  try{
    var sellers = await RentLocation.find({ City: req.params.city });
    console.log(sellers);
    res.json(sellers);
  }catch(err){
        res.status(500).json({message: err.message});
  }
  
});

module.exports = router;*/