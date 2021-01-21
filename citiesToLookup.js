const axios = require("axios");
const excelmethods = require("./methods/excel-extractions");
var citiesLookUp = require("./cities.json");
var cities = excelmethods.getListOfCities();
const dotenv = require("dotenv").config();
const API_URL= process.env.API_URL;
function citiesWrite() {
  cities.forEach((city) => {
    if (citiesLookUp[city.City.toLowerCase()] !== undefined) {
      axios
        .post(`${API_URL}/city/${city.City}`, {
          latitude: citiesLookUp[city.City.toLowerCase()].latitude,
          longitude: citiesLookUp[city.City.toLowerCase()].longitude,
          state: city.State,
        })
        .then((x) => {
          //console.log(x);
        })
        .catch((x) => {
          console.log(x);
        });
    } else {
      console.log(city.City);
    }
  });
}

function subCategoriesWrite() {
  var subcategory = excelmethods.getListOfSubcategories();
  Object.keys(subcategory).forEach((category) => {
    subcategory[category].forEach((subq) => {
      axios
        .post(`${API_URL}/categories/${category}/${subq}`)
        .then((x) => {
          // console.log(x);
        })
        .catch((x) => {
          console.log(x);
        });
    });
  });
}

async function writeDataForSubcategory(subcategory, category, city, locNum) {
  var lat, long;
  await axios
    .get(`${API_URL}/city/${city}`)
    .then(async(res) => {
      // console.log(res.data);
      if(!res.data.data.isLargeCity)
     { lat = res.data.data.latitude;
      long = res.data.data.longitude;
      await axios
    .get(
      `${process.env.TOMTOM_API_SEARCH_BASE_URL}/${subcategory}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=10000`
    )
    .then((res) => {
      let shops = res.data.results;
      shops.forEach(async (shop) => {
        if(shop.poi!==undefined && shop.poi.hasOwnProperty('name'))
        {await axios
          .post(
            `${API_URL}/shops/${city}/${category}/${subcategory}`,
            {
              shopName: shop.poi.name,
              address: shop.address.freeformAddress,
              latitude: shop.position.lat,
              longitude: shop.position.lon,
            }
          )
          .then((data) => {
          // console.log(data);
          })
          .catch((err) => {
           console.log(err);
          });}
      });
    });}
    else{
      //console.log(res.data.data.locList[locNum]);
      let lat=res.data.data.locList[locNum]['latitude'];
      let long=res.data.data.locList[locNum]['longitude'];
      // console.log(lat, long)
      if(lat===undefined || long===undefined)return;
            await axios
    .get(
      `${process.env.TOMTOM_API_SEARCH_BASE_URL}/${subcategory}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=3000`
    )
    .then((res) => {
      let shops = res.data.results;
      shops.forEach(async (shop) => {
      if(shop.poi!==undefined && shop.poi.hasOwnProperty('name'))
    {
        await axios
          .post(
            `${API_URL}/shops/${city}/${category}/${subcategory}`,
            {
              shopName: shop.poi.name,
              address: shop.address.freeformAddress,
              latitude: shop.position.lat,
              longitude: shop.position.lon,
            }
          )
          .then((data) => {
           // console.log(data);
          })
          .catch((err) => {
           console.log(err);
          });
      }});
    });
      
    }
    })
    .catch((err) => {
     console.log(err);
    });
// console.log(`${process.env.TOMTOM_API_SEARCH_BASE_URL}/${subcategory}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=10000`)
 // console.log(subcategory);
}
async function writeDataForBrand(brand, category, city, locNum) {
  var lat, long;
  await axios
    .get(`${API_URL}/city/${city}`)
    .then(async(res) => {
      // console.log(res.data);
      if(!res.data.data.isLargeCity)
     { lat = res.data.data.latitude;
      long = res.data.data.longitude;
      await axios
    .get(
      `${process.env.TOMTOM_API_SEARCH_BASE_URL}/${brand}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=10000`
    )
    .then((res) => {
      let shops = res.data.results;
      shops.forEach(async (shop) => {
        if(shop.poi!==undefined && shop.poi.hasOwnProperty('name') && new RegExp(brand,'i').test(shop.poi.name))
        {await axios
          .post(
            `${API_URL}/shops/${city}/${category}/${brand}`,
            {
              shopName: shop.poi.name,
              address: shop.address.freeformAddress,
              latitude: shop.position.lat,
              longitude: shop.position.lon,
            }
          )
          .then((data) => {
          // console.log(data);
          })
          .catch((err) => {
           console.log(err);
          });}
      });
    });}
    else{
      //console.log(res.data.data.locList[locNum]);
      let lat=res.data.data.locList[locNum]['latitude'];
      let long=res.data.data.locList[locNum]['longitude'];
      // console.log(lat, long)
      if(lat===undefined || long===undefined)return;
      await axios
    .get(
      `${process.env.TOMTOM_API_SEARCH_BASE_URL}/${brand}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=3000`
    )
    .then((res) => {
      let shops = res.data.results;
      shops.forEach(async (shop) => {
        if(shop.poi!==undefined && shop.poi.hasOwnProperty('name') && new RegExp(brand,'i').test(shop.poi.name))
{        await axios
          .post(
            `${API_URL}/shops/${city}/${category}/${brand}`,
            {
              shopName: shop.poi.name,
              address: shop.address.freeformAddress,
              latitude: shop.position.lat,
              longitude: shop.position.lon,
            }
          )
          .then((data) => {
           // console.log(data);
          })
          .catch((err) => {
           console.log(err);
          });
}      });
    });
      
    }
    })
    .catch((err) => {
     console.log(err);
    });
// console.log(`${process.env.TOMTOM_API_SEARCH_BASE_URL}/${subcategory}.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${long}&limit=100&radius=10000`)
 // console.log(subcategory);
}
// writeDataForSubcategory('Fruit Market', 'Markets', 'Patna', 0);

async function writeDataForCity(cityName,num,locNum){
await axios.get(`${API_URL}/categories`).then(res=>{
  let categories=res.data.data;
  // console.log(categories.length);
 categories.slice(0+(num*5),5+(num*5)).forEach(async(categoryObj)=>{
   await writeDataForSubcategory(categoryObj.subcategoryName,categoryObj.category,cityName,locNum);
   console.log(`Writing ${categoryObj.subcategoryName} done`);
 });
})
}

async function writeBrandedShopsForCity(cityName,num, locNum){
  await axios.get(`${API_URL}/brands`).then(res=>{
    let categories=res.data.data;
    console.log(categories.length);
   categories.slice(0+(num*5),5+(num*5)).forEach(async(categoryObj)=>{
     await writeDataForBrand(categoryObj.brand,categoryObj.brandCategory,cityName, locNum);
     console.log(`Writing ${categoryObj.brand} done`);
   });
  })
  }

async function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}
async function testWrite(){
  await writeDataForCity('Puri',0).then(data=>console.log('0 done'))
 sleep(100000);
 await writeDataForCity('Puri',1).then(data=>{console.log('1 done')});

}

// writeDataForCity('Patna',0,0);

async function writeAllBrands(){
  const brands=excelmethods.getListOfBrands();

  Object.keys(brands).forEach(category=>{
    brands[category].forEach(async(brand)=>{
      await axios.post(`${API_URL}/brands/${brand}`,{
        // brand:brand,
        brandCategory: category
      });
    })
  })
}
// citiesWrite();

// writeBrandedShopsForCity(`Unnao`,0)
// getCityMajorMarketAreas('Agra',['Colleges','Food market','Coaching centre']);

//subCategoriesWrite();
// writeDataForCity('Azamgarh',i);
const cityName=process.argv[2];
const type=process.argv[3];
const num=Number(process.argv[4]);
const iter=Number(process.argv[5]);
if(cityName && type && num!==undefined){
  switch(type){
    case 'brands': writeBrandedShopsForCity(cityName,num,iter);
                  break;
    case 'shops': writeDataForCity(cityName,num,iter);
                  break;
  }
}
else{
  console.log('Check node arguments');
  console.log(cityName, type, num);
}