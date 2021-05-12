const LeCategories = require("../models/LeCategories");

// get all subcategories in displayable form
module.exports.getAllSubcategoriesToDisplay = async (req, res) => {
  try {
    let subcategories = await LeCategories.aggregate([
      { $match: {} },
      // {$project: {
      //   category: 1,
      //   subcategory:1,
      //   "content": {
      //       "$arrayToObject": {
      //           "$map": {
      //               "input": "$subcategory",
      //               "as": "el",
      //               "in": {
      //                   "k": "$$el",
      //                   "v": "$$el"
      //               }
      //           }
      //       }
      //   }}}
      // {$project: {
      //     category: 1,
      //     subcategory:1,
      //     dimensions: { $arrayToObject: "$subcategory" }
      //  }}
      // {
      //     $unwind: {
      //         path:"$subcategory"
      //     }
      // },
      // {
      //     $addFields:{
      //         radius: 0,
      //         selected: false,
      //         disabler: false
      //     }
      // }
    ]);
    subcategories.forEach((subcategory,index) => {
      subcategory.subcategories = subcategory.subcategory.map((ele) => {
        return {
          index,
          subcategory:ele,
          disabler: false,
          selected: false,
          radius: 500,
          weight: 1,
        };
      });
    delete subcategory['subcategory'];
    });
    res.json({ error: false, subcategories });
    console.log(`here is category data ${subcategories}`)
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
