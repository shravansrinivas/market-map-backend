const LeCategories = require("../models/LeCategories");

// get all subcategories in displayable form
module.exports.getAllSubcategoriesToDisplay = async (req, res) => {
  try {
    let subcategories = await LeCategories.aggregate([{$match:{}},
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
    res.json({ error: false, subcategories });
  } catch (err) {
    return res.json({ error: true, errorMessage: err });
  }
};
