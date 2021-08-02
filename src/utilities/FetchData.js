const City = require("../models/City");
const Subcategory = require("../models/Subcategories");
const axios = require("axios");
const Establishment = require("../models/Establishment");
const shell = require("shelljs");
const BASE_API_URL = process.env.TOMTOM_API_SEARCH_BASE_URL;

// An array of API keys

// connect to mongodb
const initDB = async () => {
    require("../../initDB");
};

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

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const updateDB = (url) => {
    shell.exec("./Backup.sh");
    axios
        .get(url)
        .then((response) => {
            console.log(response);
            // run bash script to backup data
            // ---------write code here----------

            // add results to the database
            // Establishment.collection.drop();
            await Establishment.deleteMany({}).then(() => {
                console.log(
                    "Deleted all documents in establlishment colllection"
                );
            });

            // adding fetched data to database
            for (let obj of response.results) {
                const newEstablishment = new Establishment({
                    ...obj,
                });
                newEstablishment.save();
            }

            console.log("Collection updated");
        })
        .catch((err) => {
            console.log(err);
        });
};

const fetchData = async () => {
    const cities = await City.find({});
    // for (let i = 0; i < 20; i++) {
    //     console.log(cities[i].cityName);
    // }

    // There are 221 subcategories
    const subcategories = await Subcategory.find({});
    // for (let subCat of subcategories) {
    //     console.log(subCat);
    // }

    for (const city of cities) {
        const boundaryLat = city.info.locationInfo.boundaryCoordinates.minLat;
        const boundaryLon = city.info.locationInfo.boundaryCoordinates.minLon;
        for (subCat of subcategories) {
            if (city.info.generalInfo.isLargeCity) {
                // if its a large city it will have multiple coordinates
                const majorCoordinates =
                    city.info.locationInfo.majorCoordinates;
                for (const coordinate of majorCoordinates) {
                    const lat = coordinate.latitude;
                    const lon = coordinate.longitude;
                    const radius = Math.round(
                        getDistanceFromLatLonInKm(
                            lat,
                            lon,
                            boundaryLat,
                            boundaryLon
                        ) * 1000
                    );
                    const url = `${BASE_API_URL}/${subCat}.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}`;

                    updateDB(url);
                    delay(1000);
                }
            } else {
                const lat = city.info.locationInfo.centerCoordinates.latitude;
                const lon = city.info.locationInfo.centerCoordinates.longitude;
                const radius = Math.round(
                    getDistanceFromLatLonInKm(
                        lat,
                        lon,
                        boundaryLat,
                        boundaryLon
                    ) * 1000
                );
                const url = `${BASE_API_URL}/${subCat}.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}`;

                updateDB(url);
                delay(1000);
            }
        }
    }
};

const main = async () => {
    await initDB();
    fetchData();
};

// main();
