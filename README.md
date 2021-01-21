Can watch current app live at http://marketmap.letsendorse.com

# Steps for setup

1. Clone the repo using 
   `git clone https://github.com/shravansrinivas/MarketMapModule`
2. Checkout to mern-version branch
    `git checkout mern-version`
3. Install NPM modules for both backend and frontend apps
    `npm install`
    `cd react-client`
    `npm install`
4. Get .env files from admin and add them
5. Start app by running `node server.js` on root folder.
6. You can see the app running at http://localhost:8080/

## Steps to extract data for a city using the script.

1. After cloning change the permission of the file using chmod (sudo mode might be required):
    `chmod 777 ./extractDataForCity.sh`

2. Run the script with city name as an argument. (Please ensure you have mentioned city name as per the list here at http://marketmap.letsendorse.com/api/city in the cityName field since it looks up data from here.)
    `./extractDataForCity.sh CITYNAME` : replace CITYNAME with actual city name 
    Eg. `./extractDataForCity.sh Hyderabad` for extracting data for shops in Hyderabad.