/*const express = require('express')
const { handleGetAllAgarbatti } = require('../controllers/AgarbattiBusinessIdea')


const router = express.Router()


router.get(``,handleGetAllAgarbatti)

module.exports = router*/
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
