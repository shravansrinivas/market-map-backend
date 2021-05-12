const RentalLocation = require('../models/RentLocation');

/*router.get('/:cityName', async (req,res) => {
  //res.send("HELLO WORLD");
  try{
    var sellers = await RentalLocation.find();
    console.log(sellers);
    res.json(sellers);
  }catch(err){
        res.status(500).json({message: err.message});
  }
  
});*/
module.exports.handleGetAllRentLocations = async (req, res) => {
  try {
    let locations = await RentalLocation.find();
    return res.json({ error: false, locations });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

// GET ALL Prestige stores by state
module.exports.handleGetAllRentLocationsbyCity = async (req, res) => {
  try {
    let locations = await RentalLocation.find({ City: req.params.city });
    return res.json({ error: false, locations });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};

//module.exports = router;