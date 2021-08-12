# Fetch Data

Explaining the `FetchData.js` file

`backupData` and `deleteData` functions do what they say.

The `fetchData` function -

-   Gets all the cities and subcategories from the database
-   Loop over all the cities. For each city calculate it's radius using the center coordinates and boundary coordinates
-   For each city, loop over all the subcategories.
-   For each subcategory, make a call to the tomtom endpoint. In the response there will be a `summary.totalResults` property. Calculate how many calls do we need to make to get all the data from the endpoint by dividing `summary.totalResults` by 100 (In each call we get only 100 results). Increase the offset by 100 for every call. [TomTom Docs - offset](https://developer.tomtom.com/search-api/search-api-documentation-search/fuzzy-search)
-   Save the results to the database using [upsert](https://mongoosejs.com/docs/tutorials/findoneandupdate.html#upsert)

# Location Advisor Algorithm

-   Accept parameters
    -   [cityName](#cityname)
    -   [schemaName](#schemaname)
    -   [schema](#schema)
-   Create an array `schemaCategories` which contains all the selected categories (both enablers and disablers). If there are no selected categories, return an error with a message
-   [Find the top market areas in the city](#find-top-market-areas)
-   [For each market area, find it's score](#calculate-score)
-   If [schemaName]() is present then save the schema to the database
-   Return the top 10 market areas with the highest score

## Find Top Market Areas

-   Get all the establishments in the city
-   Group establishments which have the same `address.freeformAddress` together and classify them as one market area
-   Find the center latitude and center longitude of the market areas by taking the average of latitudes and longitudes respectively of all establishments present in that market area
-   Return all the market areas

## Calculate Score

-   For each market area,

    -   Create an array called `scores[]`

    -   Iterate over all the categories in `schemaCategories`. For each category ,

        -   Find the number of establishments with the same category in the market area. Set it equal to a variable `score`.

        -   If the category is a not a disabler add `score` to the `scores[]` array as it is. If the category is a disabler add `-1 * score` to the `scores[]` array.

    -   Find the sum of `scores[]` array. Set it equal to a variable `areaScore`

    -   Find sum of modulus of all the elements in the `scores[]` array. Set it equal to a variable `enablersPlusDisablers`

    -   To calculate score out of 10. We do
        `areaScore = (areaScore / enablersPlusDisablers) * 10;`

## Variables

#####`cityName`
String containing name of the city

#####`schemaName`
String containing name of the schema

#####`schema`
It is an array of objects. Each object contains -

-   \_id (String)
-   category (String)
-   subcategories[] (Array)
    -   It is an array of objects
    -   Each object contains -
        -   index (Number)
        -   subcategory (String)
        -   disabler (Boolean)
        -   selected (Boolean)
        -   radius (Number)
        -   weight (Number)
