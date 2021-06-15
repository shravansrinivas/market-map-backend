# Market Mapping Module - Backend

This repository acts as a codebase for ExpressJS backend of LE's Market mapping module. This module is built in order to map as many markets/shops/establishments as possible on the map and gain as much as possible insights as possible in order to help micro-enterprises in:
	1. Picking location for starting their business.
	2. Suggesting possible rent ranges in any location.
	3. Helping them with places to get their raw material from.
	 and much more...

------------


### Setup - Dev

#### Local Setup to run the project
1. clone this particular branch (custom-advisor) of this repository by running the following command:
`git clone https://github.com/shravansrinivas/market-map-backend.git`
2. Intall the required NPM modules with the command: `npm i` **or** `npm install`
[Make sure you have NodeJS version >12 & <16 installed. **14.16.1 recommended**] [Refer this link to install NodeJS from their website](https://nodejs.org/download/release/v14.16.1/ "Refer this link to install NodeJS from their website")
3. **Get the .env file from the admin/maintainer for dev env variables. Also make sure you have the MongoDB data dump and restore it using the `**mongorestore**` command.**
4. Start the server : `npm start`

#### Working on development of the project
1 Please create a new branch with **custom-advisor**(default branch) as base branch. You can use either of the following set of commands.
> `git branch {new_branch_name}`
`git checkout {new_branch_name}`

**OR**
> `git checkout -b {new_branch_name}`

------------


#### Maintenance and Merging
Please raise a PR (Pull Request) whenever there is a need to merge with the custom-advisor branch and assign it to the relevant maintainer/admin.

------------


#### Hosting
Currently the app is hosted at the URL https://marketmap.letsendorse.com using Nginx as reverse proxy server and PM2 as process management tool on AWS EC2 instance.


------------

&copy; 2021 LetsEndorse Development Pvt. Ltd. All rights reserved.