const City = require("../models/City");
const Subcategory = require("../models/Subcategories");
const axios = require("axios");
const LucknowEstablishments = require("../models/LucknowEstablishments");
const shell = require("shelljs");
const Lucknow = require("../models/LucknowEstablishments");

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

const addToDB = (url) => {
    axios
        .get(url)
        .then((response) => {
            console.log(response.data);

            // adding fetched data to database
            for (const obj of response.data.results) {
                const newEstablishment = new LucknowEstablishments({ ...obj });
                newEstablishment.save();
            }

            console.log("Establishment added");
        })
        .catch((err) => {
            console.log(err);
        });
};

// const backupData = async () => {
//     shell.exec("./Backup.sh");
// };

// const deleteData = async () => {
//     await Establishment.deleteMany({}).then(() => {
//         console.log("Deleted all documents in establlishment colllection");
//     });
// };

const fetchData = async () => {
    const CityArr = await City.find({ cityName: "Lucknow" });
    const Lucknow = CityArr[0];
    console.log(`Lucknow is : `, Lucknow);

    console.log(typeof Lucknow);

    // There are 221 subcategories
    const subcategories = await Subcategory.find({});
    // for (let subCat of subcategories) {
    //     console.log(subCat);
    // }

    const boundaryLat = Lucknow.info.locationInfo.boundaryCoordinates.minLat;
    const boundaryLon = Lucknow.info.locationInfo.boundaryCoordinates.minLon;

    // console.log(`Boundary coordinates are : ${boundaryLat} ${boundaryLon}`);

    for (const subCat of subcategories) {
        // const subCat = subcategories[117];
        const majorCoordinates = Lucknow.info.locationInfo.majorCoordinates;
        for (const coordinate of majorCoordinates) {
            const lat = coordinate.latitude;
            const lon = coordinate.longitude;
            // console.log(`major coordinates are : ${lat} ${lon}`);
            const radius = Math.round(
                getDistanceFromLatLonInKm(lat, lon, boundaryLat, boundaryLon) *
                    1000
            );
            // console.log(`radius is ${radius}`);
            const BASE_API_URL = process.env.TOMTOM_API_SEARCH_BASE_URL;
            const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
            const url = `${BASE_API_URL}/${subCat.name}.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}`;
            console.log(`url is ${url}`);

            await addToDB(url);
            await delay(3000);
        }
    }
};

const main = async () => {
    await initDB();
    await delay(3000);
    console.log(`Waited 3s`);
    await fetchData();
};

main();
