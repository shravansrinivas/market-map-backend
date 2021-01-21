const excelToJson = require("convert-excel-to-json");

// Extract list of brands for each categories
function getListOfBrands() {
  const result = excelToJson({
    sourceFile: "excel-files/Important_brands.xlsx",
    sheets: [
      {
        name: "Sheet1",
        columnToKey: {
          A: "Cloth brands",
          B: "Shoes brands",
          C: "Famous  restaurants",
          D: "Electronics",
          E: "Automobiles_showrooms",
          F: "Accessories",
        },
      },
    ],
  });
  var column_headers = Object.keys(result.Sheet1.shift());
  var result_to_return = {};
  column_headers.forEach((column) => {
    result_to_return[column] = [];
  });
  result.Sheet1.forEach((element) => {
    column_headers.forEach((column) => {
      if (element[column] !== undefined) {
        result_to_return[column].push(element[column]);
      }
    });
  });
  return result_to_return;
}

// List of all subcategories for all categories
function getListOfSubcategories() {
  const result = excelToJson({
    sourceFile: "excel-files/Category_shops.xlsx",
    sheets: [
      {
        name: "data",
        columnToKey: {
          A: "Markets",
          B: "Educational",
          C: "Food_stay",
          D: "Residential_areas",
          E: "Working",
          F: "Service_centres",
          G: "Miscellaneous",
          H: "Luxury",
          I: "Sports",
          J: "Cloth",
          K: "Essential_services",
          L: "Industrial_area",
        },
      },
    ],
  });
  var column_headers = Object.keys(result.data.shift());
  var result_to_return = {};
  column_headers.forEach((column) => {
    result_to_return[column] = [];
  });

  result.data.forEach((element) => {
    column_headers.forEach((column) => {
      if (element[column] !== undefined) {
        // result_to_return[column].push({[element[column]]:[]});
        result_to_return[column].push(element[column]);
      }
    });
  });
  return result_to_return;
}

// List of all subcategories for all categories
function getListOfCities() {
  const result = excelToJson({
    sourceFile: "excel-files/cities.xlsx",
    sheets: [
      {
        name: "data",
        columnToKey: {
          A: "State",
          B: "City",
        },
      },
    ],
  });
return result.data;
}

module.exports = { getListOfBrands, getListOfSubcategories, getListOfCities };
