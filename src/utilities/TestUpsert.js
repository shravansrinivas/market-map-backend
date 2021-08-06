const LucknowEstablishments = require("../models/LucknowEstablishments");

// connect to mongodb
const initDB = async () => {
    require("../../initDB");
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const testUpsert = async () => {
    // const obj = await LucknowEstablishments.findOne({});
    // console.log(obj);

    // This is a new object
    // const newObj = {
    //     type: "POI",
    //     id: "g6JpZK8zNTYwMDkwMjMyMTUzNzShY6NJTkShdqJJTg==",
    //     score: 2.5743083954,
    //     dist: 824.1091749251963,
    //     info: "search:ta:356009023215374-IN",
    //     poi: {
    //         name: "more. Bachat Bazar",
    //         brands: [
    //             {
    //                 name: "More",
    //             },
    //         ],
    //         categorySet: [
    //             {
    //                 id: 7332005,
    //             },
    //         ],
    //         categories: ["market", "supermarkets hypermarkets"],
    //         classifications: [
    //             {
    //                 code: "MARKET",
    //                 names: [
    //                     {
    //                         nameLocale: "en-US",
    //                         name: "supermarkets hypermarkets",
    //                     },
    //                     {
    //                         nameLocale: "en-US",
    //                         name: "market",
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     address: {
    //         streetName: "Rbss Sahay Road, Bhikhanpur Chowk, Bhikhanpur",
    //         municipalitySubdivision: "Bhikhanpur",
    //         municipality: "Bhagalpur",
    //         countrySecondarySubdivision: "Bhagalpur",
    //         countrySubdivision: "Bihar",
    //         postalCode: "812001",
    //         countryCode: "IN",
    //         country: "India",
    //         countryCodeISO3: "IND",
    //         freeformAddress:
    //             "Rbss Sahay Road, Bhikhanpur Chowk, Bhikhanpur, Bhikhanpur, Bhagalpur 812001, Bihar",
    //         localName: "Bhagalpur",
    //     },
    //     position: {
    //         lat: 25.24836,
    //         lon: 86.98953,
    //     },
    //     viewport: {
    //         topLeftPoint: {
    //             lat: 25.24926,
    //             lon: 86.98854,
    //         },
    //         btmRightPoint: {
    //             lat: 25.24746,
    //             lon: 86.99052,
    //         },
    //     },
    //     entryPoints: [
    //         {
    //             type: "main",
    //             position: {
    //                 lat: 25.24819,
    //                 lon: 86.98952,
    //             },
    //         },
    //     ],
    // };

    const filter = { id: newObj.id };
    const update = { ...newObj };

    let doc = await LucknowEstablishments.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
    });
    console.log(`Name is ${doc.poi.name}`);
};

const main = async () => {
    await initDB();
    await delay(3000);
    console.log(`Waited 3s`);
    testUpsert();
};

main();
