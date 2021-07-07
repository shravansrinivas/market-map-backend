const express = require('express');
const router = express.Router();
// const RequiredLicenses = require('../models/RequiredLicenses');
const requiredLicenses = require("../models/Licenses");

router.get('/', async (req,res) => {
  //res.send("HELLO WORLD");
  try{
    var licenses = await requiredLicenses.find();
    console.log(licenses);
    res.json(licenses);
  }catch(err){
        res.status(500).json({message: err.message});
  }
  
});

module.exports = router;
