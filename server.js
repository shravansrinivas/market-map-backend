//Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config();

//Routes import
const Cities = require("./routes/City");
const Subcategories = require("./routes/Subcategory");
const Shops = require("./routes/Shop");
const Misc = require("./routes/Miscellaneous");
const Brand = require("./routes/Brand");

//server
const app = express();


// // Frontend
// app.use(express.static("react-client/build"));

//Midleware
app.use(bodyparser.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Routes
app.use("/api/city", Cities);
app.use("/api/categories", Subcategories);
app.use("/api/shops", Shops);
app.use("/api/misc", Misc);
app.use("/api/brands", Brand);

//server

const PORT_NUM = process.env.PORT_NUM===undefined? 8080 : process.env.PORT_NUM;
app.listen(PORT_NUM);
console.log("Express.js Server started on " + PORT_NUM);