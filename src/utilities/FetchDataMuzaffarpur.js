const City = require("../models/City");
const Subcategory = require("../models/Subcategories");
const axios = require("axios");
const MuzaffarpurEstablishment = require("../models/MuzaffarpurEstablishments");

// connect to mongodb
const initDB = async () => {
    require("../../initDB");
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const fetchData = async () => {
    const CityArr = await City.find({ cityName: "Muzaffarpur" });
    const Muzaffarpur = CityArr[0];

    // There are 221 subcategories
    const subcategories = await Subcategory.find({});

    const lat = Muzaffarpur.info.locationInfo.centerCoordinates.latitude;
    const lon = Muzaffarpur.info.locationInfo.centerCoordinates.longitude;
    const radius = 3000;

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
                    key: TOMTOM_API_KEY,
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

                        await MuzaffarpurEstablishment.findOneAndUpdate(
                            filter,
                            update,
                            { new: true, upsert: true }
                        );
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

const main = async () => {
    await initDB();
    await delay(3000);
    console.log(`Waited 3s`);
    // await fetchData();

    // const myName = "Jane";
    // axios
    //     .get("https://api.genderize.io/", { params: { name: myName } })
    //     .then((response) => {
    //         console.log(response.data);
    //     })
    //     .catch((err) => console.log(err));
};

main();
