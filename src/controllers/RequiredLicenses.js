const express = require('express');
const router = express.Router();
const RequiredLicenses = require('../models/RequiredLicenses');

router.get('/', async (req,res) => {
  //res.send("HELLO WORLD");
  try{
    var sellers = await RequiredLicenses.find();
    console.log(sellers);
    res.json(sellers);
  }catch(err){
        res.status(500).json({message: err.message});
  }
  
});

module.exports = router;
