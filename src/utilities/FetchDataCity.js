const City = require("../models/City");
const Subcategory = require("../models/Subcategories");
const axios = require("axios");
const Establishment = require("../models/Establishment");
require("dotenv").config();

// An array of API keys
const API_KEYS_ARRAY = process.env.TOMTOM_API_KEYS_STRING.split(",");
const noOfApiKeys = API_KEYS_ARRAY.length;

// connect to mongodb
const initDB = async () => {
    require("../../initDB");
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const fetchData = async (cityName) => {
    const city = await City.findOne({ cityName });

    // There are 221 subcategories
    const subcategories = await Subcategory.find({});

    const boundaryLat = city.info.locationInfo.boundaryCoordinates.maxLat;
    const boundaryLon = city.info.locationInfo.boundaryCoordinates.maxLon;
    const lat = city.info.locationInfo.centerCoordinates.latitude;
    const lon = city.info.locationInfo.centerCoordinates.longitude;
    const radius = Math.round(
        getDistanceFromLatLonInKm(lat, lon, boundaryLat, boundaryLon) * 1000
    );

    let apiCalls = 0;
    let apiKeysArrayIndex = 0;

    for (const subCat of subcategories) {
        const BASE_API_URL = process.env.TOMTOM_API_SEARCH_BASE_URL;
        const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

        let offset = 0;
        let totalCallsRequired = 1;
        // To keep track of iterations
        // Only calculate totalCallsRequires during first result
        let i = 0;

        while (totalCallsRequired > 0) {
            totalCallsRequired--;
            const url = `${BASE_API_URL}/${subCat.name}.json/`;

            const config = {
                params: {
                    key: API_KEYS_ARRAY[apiKeysArrayIndex],
                    lat,
                    lon,
                    radius,
                    limit: 100,
                    ofs: offset,
                },
            };

            await axios
                .get(url, config)
                .then(async (response) => {
                    const res = response.data;

                    apiCalls++;
                    if (apiCalls === 2500 && apiKeysArrayIndex <= noOfApiKeys) {
                        apiCalls = 0;
                        apiKeysArrayIndex++;
                    }

                    if (i == 0) {
                        const totalResults = response.data.summary.totalResults;
                        totalCallsRequired = Math.floor(totalResults / 100);
                        if (totalResults % 100 === 0) {
                            totalCallsRequired -= 1;
                        }
                    }

                    // saving data to database
                    for (const obj of response.data.results) {
                        const filter = { id: obj.id };
                        const update = { ...obj };

                        await Establishment.findOneAndUpdate(filter, update, {
                            new: true,
                            upsert: true,
                        });
                    }

                    console.log(
                        `${subCat.name} added to database, API call number : ${i}`
                    );
                })
                .catch((err) => {
                    console.log(`Error in ${subCat.name} is `, err);
                });

            i++;
            offset += 100;
            await delay(1000);
        }
    }
};

const main = async (cityName) => {
    await initDB();
    await delay(3000);
    console.log(`Waited 3s`);
    await fetchData(cityName);

    // set flag to false
    const updatedFlag = { isDataBeingFetched: false };
    await City.findOneAndUpdate({ cityName }, { $set: updatedFlag });
};

// main();

module.exports = { main };
