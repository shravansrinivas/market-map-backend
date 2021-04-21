const express = require("express"),
  mongoose = require("mongoose"),
  compression = require("compression"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors");

// to load .env
require("dotenv").config();

// connect to mongodb
require("./initDB");

const app = express();

// use compression to reduce the size using gzip
app.use(compression());

// enable cors
app.use(cors());

// logging using morgan
app.use(morgan("combined")); // use apache format

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// home route
app.get("/", function (req, res) {
  return res.send(`
    <html>
        <head>
            <title>Market Map Backend</title>
            <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash&display=swap" rel="stylesheet" />
            <link rel="icon" type="image/png" href="https://www.letsendorse.com/favicons/favicon-32x32.png" sizes="32x32" />
        </head>
        <body style="display: flex; align-items: center; justify-content: center;">
            <h1 style="text-align: center; font-size: 80px; letter-spacing: 3px; color: #ef5a20; font-family: 'Berkshire Swash', cursive; margin: 0;">Market Map Backend</h1>
        </body>
    </html>
`);
});

//all routes
require("./src/startup/routes")(app);

const PORT_NUM = process.env.SERVER_PORT_NUM || 8085;

// express server
app.listen(PORT_NUM, () => {
  console.info(
    `Server has started and is now listening on PORT-${PORT_NUM}! Wait till mongodb connection comes through and then we are live in no time:)`
  );
});
