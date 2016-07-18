var express = require('express');
var bodyParser = require('body-parser')
var db=require('./modules/dbconnection');
var GeoTable=require('./modules/geoTable');
var GeoClass=require('./modules/geoClass');
var app = express();

//app get request session for basic table queries

const dbInst=new db.DBModule();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  	res.send('Hello World!');
});

app.get('/test', function (req, res) {
	res.sendfile('test/test.html');
});

app.get('/table', function (req, res) {
	dbInst.connecDB();
	res.send('db connected');
});

// Route path: /tablename/:rowid
// Request URL: http://localhost:3000/arrests/34
// req.params: { "tablename": "arrests", "rowid": "34" }

app.get('/data/:tablename/:rowid', function (req, res) {
	var table=req.params.tablename, rowid=req.params.rowid;
	
	var geoTable=new GeoTable.GeoTable(table);
	geoTable.setQueryID(rowid);
	dbInst.setTableName(table);
	dbInst['query'+table].apply(null,[geoTable, res]);
	//dbInst.queryTable()

	//console.log("data: "+table+","+rowid);
	//res.send("data: "+table+","+rowid);
	//var testdb=new db.DBModule();
	//testdb.getArrest(1);
  	//res.send(result);
});

app.get('/testQuery', function (req, res) {
	var testdb=new db.DBModule();
	testdb.getArrest(1);
  	res.send('GetArrest');
});

app.get('/testTable', function (req, res) {
	var temp=new GeoTable.GeoTable("testName");
	temp.getData(1);
  	res.send('Get Table');
});

//app post request session for spatial queries
app.post('/data/:tablename/geo', function (req, res) {
	console.log(req.body);
	var table=req.params.tablename, rowid=req.params.rowid;
	var lat=req.body.lat, lng=req.body.lng, radius=req.body.radius;

	var geoTable=new GeoTable.GeoTable(table);
	geoTable.setQueryID(rowid);
	dbInst.setTableName(table);
	dbInst['query'+table+'Geo'].apply(null,[geoTable, lat, lng, radius, res]);

});

app.post('/data/:tablename/time', function (req, res) {
	console.log(req.body);
	var table=req.params.tablename, rowid=req.params.rowid;
	var timeStart=req.body.timeStart, timeEnd=req.body.timeEnd;

	var geoTable=new GeoTable.GeoTable(table);
	geoTable.setQueryID(rowid);
	dbInst.setTableName(table);
	dbInst['query'+table+'Time'].apply(null,[geoTable, timeStart, timeEnd, res]);

});

// app.get('/geofeature', function (req, res) {
// 	var temp=new GeoClass.GeoFeature({name:"testName"});
// 	console.log(temp.lat);
//   	res.send('Get geofeature');
// });

app.listen(3000, function () {
  	console.log('Example app listening on port 3000!');
});