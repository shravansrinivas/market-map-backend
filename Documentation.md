# Fetch Data
Explaining the `FetchData.js` file

`backupData` and `deleteData` functions do what they say.

The `fetchData` function - 
* Gets all the cities and subcategories from the database
* Loop over all the cities. For each city calculate it's radius using the center coordinates and boundary coordinates
* For each city, loop over all the subcategories.
* For each subcategory, make a call to the tomtom endpoint. In the response there will be a `summary.totalResults` property. Calculate how many calls do we need to make to get all the data from the endpoint by dividing `summary.totalResults` by 100 (In each call we get only 100 results). Increase the offset by 100 for every call. [TomTom Docs - offset](https://developer.tomtom.com/search-api/search-api-documentation-search/fuzzy-search)
* Save the results to the database using [upsert](https://mongoosejs.com/docs/tutorials/findoneandupdate.html#upsert)


