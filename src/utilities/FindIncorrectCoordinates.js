const City = require("../models/City");
const axios = require("axios");
const WrongCoordinate = require("../models/WrongCoordinates");

const initDB = async () => {
    require("../../initDB");
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const checkIfIncorrect = async (lat, lon, city) => {
    const BASE_API_URL = process.env.POSITION_STACK_API_BASE_URL;
    const API_KEY = process.env.POSITION_STACK_API_KEY;
    const coordinates = `${lat},${lon}`;
    const limit = 1;
    const url = `${BASE_API_URL}/reverse?access_key=${API_KEY}&query=${coordinates}&limit=${limit}`;
    axios
        .get(url)
        .then(async (response) => {
            console.log(response.data);
            const res = response.data;
            const obj = res.data[0];

            if (city.cityName === obj.county) {
                console.log(`Correct coordinates`);
            } else {
                console.log(`Wrong coordinates`);

                const foundCity = await WrongCoordinate.findOne({
                    city: city.cityName,
                });
                const coordinates = {
                    lat: obj.latitude,
                    lon: obj.longitude,
                };

                if (foundCity) {
                    // foundCity.wrongCoordinates is an array
                    const newWrongCoordinates = [
                        ...foundCity.wrongCoordinates,
                        coordinates,
                    ];

                    foundCity.wrongCoordinates = newWrongCoordinates;
                    await foundCity.save();
                    return;
                }

                const newWrongCoordinateDocument = new WrongCoordinate({
                    city: city.cityName,
                    wrongCoordinates: [coordinates],
                    correctCity: obj.county,
                });
                await newWrongCoordinateDocument.save();
            }
        })
        .catch((err) => {
            console.log(`Error in ${city.cityName}`, err);
        });
};

const findIncorrectCoordinates = async () => {
    const cities = await City.find({});

    for (const city of cities) {
        // const city = await cities.find((city) => city.cityName === "Ranchi");
        // console.log(city);
        if (city.info.generalInfo.isLargeCity) {
            const majorCoordinates = city.info.locationInfo.majorCoordinates;
            for (const coordinate of majorCoordinates) {
                const lat = coordinate.latitude;
                const lon = coordinate.longitude;
                await checkIfIncorrect(lat, lon, city);
                console.log(`Big city checked`);
                await delay(2000);
            }
        } else {
            const lat = city.info.locationInfo.centerCoordinates.latitude;
            const lon = city.info.locationInfo.centerCoordinates.longitude;
            await checkIfIncorrect(lat, lon, city);
            console.log(`Small city checked`);
            await delay(2000);
        }
    }
};

const main = async () => {
    await initDB();
    await delay(3000);
    console.log(`Waited 3s`);
    findIncorrectCoordinates();
};

main();
