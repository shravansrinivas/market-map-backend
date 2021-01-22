const express = require("express");
const { route } = require("./Shop");
const axios = require("axios");
const router = express.Router();
const Shops = require("../models/Shop");
var dotenv = require("dotenv").config({ path: __dirname + "/../.env" });

const API_URL = process.env.API_URL;

// Methods
async function getMajorMarketAreas(data, list) {
  let marketLookUp = {};
  if (list === undefined || list.length === 0) {
    let categories = ['totalShops','latitude','longitude'];
    await getListOfSubcategories().then((subcategories) => {
      subcategories.forEach((category) => {
        categories.push(category.subcategory);
      });
    });
    list = categories;
    // console.log(categories);
  }
 // console.log(list);
  data.forEach((shop) => {
    if (marketLookUp[shop.address] === undefined) {
      marketLookUp[shop.address] = { [shop.subcategory]: 1,['latitude']:shop.latitude,['longitude']:shop.longitude };
    } else {
      if (marketLookUp[shop.address][shop.subcategory] === undefined)
        marketLookUp[shop.address][shop.subcategory] = 1;
      else marketLookUp[shop.address][shop.subcategory] += 1;
    }
  });
  let res = [];
  Object.keys(marketLookUp).forEach((address) => {
    let sum = 0;
    Object.keys(marketLookUp[address]).forEach((subcategory) => {
      list.forEach((listsubcategory) => {
        if (subcategory == listsubcategory && subcategory!=='latitude' && subcategory!=='longitude') {
           sum = sum + marketLookUp[address][subcategory];
        }
      });
      marketLookUp[address]['totalShops']=sum;
    });
    if (sum >= 5) {
      let sample = {};
      list.forEach((subcategory) => {
        sample[subcategory] =
          marketLookUp[address][subcategory] === undefined
            ? 0
            : marketLookUp[address][subcategory];
      });
      res.push({ [address]: sample });
    }
  });
  
  return res;
}
async function getListOfSubcategories() {
  let subcategories = [];
  let subcategoriesToFetch = await axios
    .get(`${API_URL}/categories`)
    .then((res) => {
      res.data.data.forEach((subcategory) => {
        subcategories.push({
          subcategory: subcategory.subcategoryName,
          category: subcategory.category,
        });
      });
    })
    .catch((err) => {
      console.log("Error occured:" + err);
    });
  return subcategories;
}
async function getCityMajorMarketAreas(cityName, list) {
  let result;
  await axios
    .get(`${API_URL}/shops/${cityName}`)
    .then(async (data) => {
      await getMajorMarketAreas(data.data.data, list).then((res) => {
        result = res;
        return res;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  return result;
}

// routes
// Major market areas in a city of particular types of shops from the list
router.get(`/:cityName/majorMarketAreas`, async (req, res) => {
  await getCityMajorMarketAreas(req.params.cityName, req.body.list)
    .then((data) => res.json({ data }))
    .catch((err) => {
      errorMessage: err;
    });
});

// v2
router.get(`/:cityName/majorMarketAreas/v2`, async (req, resp) => {
  await getCityMajorMarketAreas(req.params.cityName, req.body.list)
    .then((data) => {
      let res={};
     // console.log(data.length);
 
      data.forEach(marketObj=>{
        let addr=Object.keys(marketObj)[0].split(',');
        let streetName=addr.slice(0,addr.length-1);
        if(Object.keys(res).indexOf(streetName)==-1){
          res[streetName]=marketObj[Object.keys(marketObj)[0]];
        }
        else{
          let currShops=marketObj[Object.keys(marketObj)[0]];
          let prevShops=res[streetName];
          let newObj={};
          Object.values(prevShops).forEach(category=>{
            newObj[category]=prevShops[category]+currShops[category];
          });
          res[streetName]=newObj;
        }
      });
      let result=[];
      Object.keys(res).forEach(ele=>{
        result.push({[ele]:res[ele]});
      })
      resp.json({data:result});
    }).catch(err=>{resp.json({errorMessage:err})});
});

// v3
router.put(`/:cityName/majorMarketAreas/v3`, async (req, resp) => {
  let cityName = req.params.cityName, list = req.body.list;
  let filter = {
    cityName: cityName
  };
  let marketLookUp = {};
  if(list!==undefined && list.length){
    filter['subcategory']={$in:list};
  }
  await Shops.find(filter).then(shops=>{
    var finishFilter = new Promise((resolve, reject) => {
    shops.forEach(async(shop,index, array)=>{
      if(marketLookUp[shop.address]===undefined){
        //marketLookUp[shop.address]=  shop.address;//await Shops.count({...filter, address:shop.address});
        let shopCount= await Shops.count({...filter, address:shop.address});
        marketLookUp[shop.address]={count:shopCount, latitude:shop.latitude, longitude:shop.longitude}
      }if (index === array.length - 1) resolve();
    });
  
  });
  finishFilter.then(() => {
    return resp.json({data:marketLookUp})  });
    
  })//.then(data=>
  //)
  //.catch(err=>      resp.json({errorMessage:err}))

});

// Shops nearby a given address
router.put(`/nearAddress/`, async (req, res) => {
  let results = [];
  let refLat, refLng;
  // console.log(req.body);
  if (req.body.list === undefined) req.body.list = [];
  
  await axios
    .get(
      `${process.env.MAPQUEST_API_BASE}${
        process.env.MAPQUEST_API_KEY
      }&street=${req.query.street}&city=${req.query.city}&state=${req.query.state}&postalCode=${req.query.zip}&adminArea1=IN`
    )
    .then(async (response) => {
      // console.log(response.data.results[0]["locations"][0]["latLng"]["lng"],response.data.results[0]["locations"][0]["latLng"]["lat"]);
      const shops = await Shops.find({ cityName: req.query.city })
        .then(async (shops) => {
          refLat = response.data.results[0]["locations"][0]["latLng"]["lat"];
          refLng = response.data.results[0]["locations"][0]["latLng"]["lng"];
          // console.log(refLat, refLng);
          shops.forEach((shop) => {
            if (
              arePointsNear(
                { lng: shop.longitude, lat: shop.latitude },
                { lat: refLat, lng: refLng },
                2.5
              ) &&
              (req.body.list.includes(shop.subcategory) ||
                req.body.list.length === 0)
            ) {
              results.push(shop);
            }
          });
          res.json({ data: results, points: [refLat, refLng] });
        })
        .catch((err) => {
          res.json({ errorMessagehere: err });
        });
    })
    .catch((err) => {
      res.json({ errorMessage: err });
    });
});

// Shops of a particular type near a location
router.put(`/nearLoc`, async (req, res) => {
  let results = [];
  let refLat = Number(req.query.lat);
  let refLng = Number(req.query.lng);
  const shops = await Shops.find({
    latitude: {
      $gte: refLat - 0.1,
      $lte: refLat + 0.1,
    },
    longitude: {
      $gte: refLng - 0.1,
      $lte: refLng + 0.1,
    },
  })
    .then(async (shops) => {
      shops.forEach((shop) => {
        if (
          arePointsNear(
            { lng: shop.longitude, lat: shop.latitude },
            { lat: refLat, lng: refLng },
            req.query.radius===undefined?0.5:Number(req.query.radius)
          ) &&
          (req.body.list === undefined || req.body.list.includes(shop.subcategory) ||req.body.list.includes(shop.category) ||
            req.body.list.length === 0)
        ) {
          results.push(shop);
        }
      });
      res.json({ data: results });
    })
    // .catch((err) => {
    //   res.json({ errorMessage: err });
    // });
});

// // favourable places for a shop
// router.get(`/:cityName/favourableLoc/:subcategory`, async(req,res)=>{
//   await axios.get(`${process.env.API_URL}/misc/${req.params.cityName}/majorMarketAreas/v2`).then(data=>{
//     let prospective_places={};
//     let favourable_categories=[masjid, connectivity, residential areas.]
//     data.data.data.forEach(obj=>{
//       let spot=Object.keys(obj)[0];

//     })
//     res.json({message:'all ok'})
//   }).catch(err=>res.json({errorMessage:err}))
// })
// supporting methods
function arePointsNear(checkPoint, centerPoint, km) {
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}
function btwPoints(l1,L1,l2,L2) {
  let centerPoint = {lng:l1,lat:L1};
  let checkPoint = {lng:l2,lat:L2};
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy)// <= km;
}
// // def haversine_vectorize(lon1, lat1, lon2, lat2):
// //     newlon = lon2 - lon1
// //     newlat = lat2 - lat1

// //     haver_formula = np.sin(newlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(newlon/2.0)**2
    
// //     dist = 2 * np.arcsin(np.sqrt(haver_formula ))
// //     km = 6367 * dist #6367 for distance in KM
// //     return km


// // def new_plan(df):
// //     x = np.radians(df['Latitude'])
// //     y = np.radians(df['Longitude'])
// //     #centroid = (np.sum(x) / len(x), np.sum(y) / len(y))
// //     centroid = ((np.max(x)+np.min(x)) / 2, (np.max(y)+np.min(y)) / 2)
// //     alpha = haversine_vectorize(x, y, centroid[0], centroid[1])
// //     df["Distance"] = alpha
// //     beta = np.min(alpha)
// //     print(df.loc[df['Distance'] == beta])
// //     #print(alpha)
// function haversine_vectorize(lon1, lat1, lon2, lat2){
//   let newLon = lon2-lon1;
//   let newLat = lat2-lat1;

//   let haver_formula = (Math.sin(newLat/2))^2 + (Math.cos(lat1) * Math.cos(lat2)) * ((Math.sin(newLon/2))^2);
//   let dist = 2*Math.asin(Math.sqrt(haver_formula));
//   //console.log(lon1, lon2, lat1, lat2)
//   console.log(dist)
//   return (6367* dist ); // to return value in km
// } 
function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  //if (unit=="K")
   { dist = dist * 6367}//1.609344}// 6367 }
  //if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
router.get('/suggestPlaceForShop/', async (req,res) => {
  let subcategory= req.query.subcategory;
  let cityName= req.query.cityName;
  if(subcategory===undefined || cityName===undefined) return res.json({err:"subcategory and city name required"});
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':-1}).then(s=>{if(s===null)return res.json({message:"dataNotExtracted",err:"seems like data has not been extracted yet!"})});
  
  let maxLong, minLong, maxLat, minLat;
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':-1}).then(s=>{maxLat=s.latitude});
  await Shops.findOne({cityName:cityName, subcategory:subcategory}).sort({'longitude':-1}).then(s=>maxLong=s.longitude);
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':+1}).then(s=>minLat=s.latitude);
  await Shops.findOne({cityName:cityName, subcategory:subcategory}).sort({'longitude':+1}).then(s=>minLong=s.longitude);
  let centroid = [(maxLat+minLat)/2,(maxLong+minLong)/2];
  let alphas=[];
  // console.log(centroid, maxLong, minLong, maxLat, minLat)

  await Shops.find({cityName:cityName,subcategory:subcategory}).then(shops=>{
    shops.forEach(shop=>{
      //console.log(haversine_vectorize(degrees_to_radians(Number(shop.longitude)),degrees_to_radians(Number(shop.latitude)),centroid[1],centroid[0])      )
     alphas.push({shopName:shop.shopName,alpha:distance(Number(shop.longitude),Number(shop.latitude),Number(centroid[1]),Number(centroid[0])),lat:shop.latitude,lon:shop.longitude});
      //alphas[shop.shopName]=distance(degrees_to_radians(shop.longitude),degrees_to_radians(shop.latitude),degrees_to_radians(centroid[1]),degrees_to_radians(centroid[0]),'K');
      // console.log(alphas[shop.shopName])
    });
  });
  function compare( a, b ) {
    if ( a.alpha < b.alpha ){
      return -1;
    }
    if ( a.alpha > b.alpha ){
      return 1;
    }
    return 0;
  }
  
  alphas.sort(compare);
 // console.log(alphas[0]);
  res.json({alphas})
  
}); 

router.put('/getTopTwo/', async (req,res) => {
  let subcategory= req.query.subcategory;
  let cityName= req.query.cityName;
  if(subcategory===undefined || cityName===undefined) return res.json({err:"subcategory and city name required"});
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':-1}).then(s=>{if(s===null)return res.json({message:"dataNotExtracted",err:"seems like data has not been extracted yet!"})});
  
  let maxLong, minLong, maxLat, minLat;
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':-1}).then(s=>{maxLat=s.latitude});
  await Shops.findOne({cityName:cityName, subcategory:subcategory}).sort({'longitude':-1}).then(s=>maxLong=s.longitude);
  await Shops.findOne({cityName:cityName,subcategory:subcategory}).sort({'latitude':+1}).then(s=>minLat=s.latitude);
  await Shops.findOne({cityName:cityName, subcategory:subcategory}).sort({'longitude':+1}).then(s=>minLong=s.longitude);
  let centroid = [(maxLat+minLat)/2,(maxLong+minLong)/2];
  let alphas=[];
  // console.log(centroid, maxLong, minLong, maxLat, minLat)

  await Shops.find({cityName:cityName,subcategory:subcategory}).then(shops=>{
    shops.forEach(shop=>{
      //console.log(haversine_vectorize(degrees_to_radians(Number(shop.longitude)),degrees_to_radians(Number(shop.latitude)),centroid[1],centroid[0])      )
     alphas.push({shopName:shop.shopName,alpha:distance(Number(shop.longitude),Number(shop.latitude),Number(centroid[1]),Number(centroid[0])),lat:shop.latitude,lon:shop.longitude});
      //alphas[shop.shopName]=distance(degrees_to_radians(shop.longitude),degrees_to_radians(shop.latitude),degrees_to_radians(centroid[1]),degrees_to_radians(centroid[0]),'K');
      // console.log(alphas[shop.shopName])
    });
  });
  function compare( a, b ) {
    if ( a.alpha < b.alpha ){
      return -1;
    }
    if ( a.alpha > b.alpha ){
      return 1;
    }
    return 0;
  }
  
  alphas.sort(compare);

  let listOfAreas = alphas.slice(0,20);
  let type= [req.query.subcategory];
  let result = [];
  let proms=[];
  let filterProm = new Promise((resolve, reject)=>
{  listOfAreas.forEach(async(area,index,array)=>{
  let results=[];
  let refLat = area.lat, refLng = area.lon ;
  const shops = await Shops.find({
    latitude: {
      $gte: refLat - 0.1,
      $lte: refLat + 0.1,
    },
    longitude: {
      $gte: refLng - 0.1,
      $lte: refLng + 0.1,
    },
    subcategory: type
  })
    .then(async (shops) => {
      shops.forEach((shop) => {
        if (
          arePointsNear(
            { lng: shop.longitude, lat: shop.latitude },
            { lat: refLat, lng: refLng },
            .5
          )
        ) {
          results.push(shop);
        }
      });
      return results.length;
    })
    .then(count=>{
      area['count']=count;
      result.push(area);
    });
    if(index==array.length - 1)resolve();
  })
});
    filterProm.then(()=>{
      const compare =  ( a, b ) => {
        if ( a.count > b.count ){
          return -1;
        }
        if ( a.count < b.count ){
          return 1;
        }
        return 0;
      }
      return res.json({data:result.sort(compare)});
    
    })
    
    
  

});
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
// suggestShopLocation('Cloth', "Agra");
// def new_plan(df):
//     x = np.radians(df['Latitude'])
//     y = np.radians(df['Longitude'])
//     #centroid = (np.sum(x) / len(x), np.sum(y) / len(y))
//     centroid = ((np.max(x)+np.min(x)) / 2, (np.max(y)+np.min(y)) / 2)
//     alpha = haversine_vectorize(x, y, centroid[0], centroid[1])
//     df["Distance"] = alpha
//     beta = np.min(alpha)
//     print(df.loc[df['Distance'] == beta])
module.exports = router;

// console.log(arePointsNear({lng:77.942256,lat:27.162718},{lng:77.98502,lat:27.17616},5))
