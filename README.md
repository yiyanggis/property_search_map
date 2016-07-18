# geoand-backend

web services to query geo-database and commit spatial operation

## Installation
1. clone project
2. run "npm install" to install necessary packages
3. run "npm start" or "node index.js" to start server
4. test on browser with localhost:3000/

## Usage

1. for basic queries
GET /data/:tablename/:rowid
e.g. http://localhost:3000/data/Arrest/3

2. for geo queries
POST /data/:tablename/geo
http://localhost:3000/data/Arrest/geo
body={
		'lat':39.3,
		'lng':-76.616,
		'radius':100 //m
	 }

3. for temporal queries
POST /data/:tablename/time
http://localhost:3000/data/Arrest/time
body={
		'timeStart':1464430236,
		'timeEnd':1464516636
	 }


## Contributing

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license