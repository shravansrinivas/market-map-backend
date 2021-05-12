//Import the mongoose module
var mongoose = require("mongoose");

// to load .env
require("dotenv").config();

//Set up default mongoose connection

var mongoDB =
  process.env.MONGO_URL && process.env.MONGO_PORT && process.env.MONGO_DBNAME
    ? `mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`
    : "mongodb://127.0.0.1:27017/market-map";

mongoose.connect(mongoDB, {useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true });
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// on successful connection
db.once('open', function() {
    console.info('MongoDB connection successful. Now the backend is succesfully running!')
  });