/*const AgarbattiBusinessIdea = require("../models/AgarbattiBusinessIdea");

module.exports.handleGetAllAgarbatti = async (req, res) => {
  try {
    let ideas = await AgarbattiBusinessIdea.find();
    return res.json({ error: false, ideas });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};*/

const express = require('express');
const router = express.Router();
const AgarbattiBusinessIdea = require('../models/AgarbattiBusinessIdea');

router.get('/', async (req,res) => {
  //res.send("HELLO WORLD");
  try{
    var sellers = await AgarbattiBusinessIdea.find();
    console.log(sellers);
    res.json(sellers);
  }catch(err){
        res.status(500).json({message: err.message});
  }
  
});

module.exports = router;
