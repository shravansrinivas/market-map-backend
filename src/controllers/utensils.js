const axios = require("axios");

// const utensils= require("C:/Users/hp pc/Downloads/utensils.json");
const Establishment = require("../models/Establishment");
const async = require("async");

module.exports.handleUtensilStorePostEstablishment = async (req, res) => {
 // try {
     // axios.get(
       // 'C:/Users/hp pc/Downloads/utensils.json').then(async (response) => {
        let data = require('C:/Users/hp pc/Downloads/utensils.json')
          console.log(`the data is following`);
           //let { data } = response;
          console.log(`the data is as follows`);
          
           
          //console.log(`trying to save ${data}`);
         for(var i=0;i<data.length;i++){
            
          let Est_to_save = new Establishment({
            type: "POI",
            id: "",
            score: null,
            dist:null,
            info: "",
            poi: {
              name: data[i].name,
              //name: "",
              categorySet: [
                {
                  id: null,
                },
              ],
              categories: ["utensil store"],
              classifications: [
                {
                  code: "",
                  names: [
                    {
                      nameLocale: "",
                      name: "",
                    },
                  ],
                },
              ],
            },
            address: {
              streetName: "",
              municipalitySubdivision: "",
              municipality:data.district,
              countrySecondarySubdivision: "",
              countrySubdivision:data[i].state,
              postalCode:data[i].pincode,
              countryCode: null,
              country: null,
              countryCodeISO3: null,
              freeformAddress: data[i].address,
              localName: null,
            },
            position: {
              lat: data[i].latitude,
              lon: data[i].longitude,
              
            },
            viewport: {
              topLeftPoint: {
                lat: null,
                lon: null,
              },
              btmRightPoint: {
                lat: null,
                lon: null,
              },
            },
            entryPoints: [
              {
                type: null,
                position: {
                  lat: null,
                  lon: null,
                },
              },
            ],
          });
          console.log('does it work here');
          Est_to_save.save(function(err,data){
            if(err){
              console.log(err);
              console.log('hii heres an error')
              return;
            }
            
              //console.log(data)
              console.log('hii its working')
            //return res.json()
          });
        }
          console.log('hii');
          return res.json({ error: false, message:"shops saved" });
       // })
       /* .catch((err) => {
          console.log('error in file catch')
          return res.json({ error: true, errorMessage: err });
        });*/
   /* } catch (err) {
      console.log('error in function catch')
      return res.json({ error: true, errorMessage: err });
    }*/
  };
  
