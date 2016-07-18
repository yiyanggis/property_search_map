(function(){
  var pg = require('pg');
  const config=require('../resources/config').config_dev;
  const config_geo=require('../resources/config').config_geo;
  const DBConfig=require('../resources/db_config').db_config;

  var Arrest=require("./Arrest").Arrest;
  var Market=require("./Market").Market;
  var NYEvent=require("./NYEvent").NYEvent;
  var LiquorLic=require("./LiquorLic").LiquorLic;

  /*
  * desc: Handler of database connection and query
  */
  var DBModule = function() {
      var self = this;

      self.pgHost=config.host;
      self.pgPort=config.port;
      self.pgDB=config.database;
      self.pgUser=config.user;
      self.pgCred=config.password;

      self.client=null;
      self.response=null;

      self.tableName=null;

      self.setTableName=function(tableName){
        self.tableName=tableName;
      }

      self.connecDB=function(){
        
        var client = new pg.Client(self.createConnStr());

        // connect to database
        client.connect(function (err) {
          if (err) throw err;

          // execute a query on database
          client.query('SELECT $1::text as name', ['test'], function (err, result) {
            if (err) throw err;

            // just print the result to the console
            console.log(result.rows[0]);

            // disconnect the client
            client.end(function (err) {
              if (err) throw err;
            });
          });
        });
      }

      self.processQuery=function(queryStr){
        self.client = new pg.Client(self.createConnStr());
        //console.log(queryStr);
        self.client.connect(function (err) {
          if (err) throw err;

          self.client.query(queryStr, self.returnQueryResult);
        });
      }

      self.processQueryForMulti=function(queryStr){
        self.client = new pg.Client(self.createConnStr());
        //console.log(queryStr);
        self.client.connect(function (err) {
          if (err) throw err;

          self.client.query(queryStr, self.returnQueryResults);
        });
      }

      self.createConnStr=function(){
        var connectionStr='postgres://';
        connectionStr+=self.pgUser;
        connectionStr+=":";
        connectionStr+=self.pgCred;
        connectionStr+="@";
        connectionStr+=self.pgHost;
        connectionStr+=":";
        connectionStr+=self.pgPort;
        connectionStr+="/";
        connectionStr+=self.pgDB;

        return connectionStr;
      }


      self.queryTable=function(name, id){
        var tableName=DBConfig[name].tableName;

        if(tableName==null){
          return null
        }
        else{
          var queryStr="select *, ST_AsGeoJSON(geom) as geojson from "+tableName+" where gid="+id;
          console.log(queryStr);
          this.processQuery(queryStr, self.returnQueryResult);
        }

        
      }

      self.queryCityList=function(res){
        var client = new pg.Client(self.createConnStr());

        // connect to database
        client.connect(function (err) {
          if (err) throw err;

          // execute a query on database
          client.query('select distinct city from property_list', function (err, result) {
            if (err) throw err;

            // just print the result to the console
            res.send(result.rows);

            // disconnect the client
            client.end(function (err) {
              if (err) throw err;
            });
          });
        });
      }

      self.queryCityHistory=function(cityName,res){
        var client = new pg.Client(self.createConnStr());

        // connect to database
        client.connect(function (err) {
          if (err) throw err;

          var queryStr="select * from property_list where city='"+cityName+"';";

          //console.log(queryStr);

          // execute a query on database
          client.query(queryStr, function (err, result) {
            if (err) throw err;

            // just print the result to the console
            res.send(result.rows);

            // disconnect the client
            client.end(function (err) {
              if (err) throw err;
            });
          });
        });
      }

      self.queryCityTable=function(tablename,res){
        var client = new pg.Client(self.createConnStr());

        // connect to database
        client.connect(function (err) {
          if (err) throw err;

          var queryStr="select * from "+tablename+";";

          // execute a query on database
          client.query(queryStr, function (err, result) {
            if (err) throw err;

            // just print the result to the console
            res.send(result.rows);

            // disconnect the client
            client.end(function (err) {
              if (err) throw err;
            });
          });
        });
      }

      self.queryTableGeo=function(name, lat, lng, radius){
        var tableName=DBConfig[name].tableName;

        if(tableName==null){
          return null
        }
        else{
          var queryStr="select *, ST_AsGeoJSON(geom) as geojson from "+ tableName +
          " where ST_Intersects(ST_Buffer(ST_SetSRID(ST_POINT(" + lng + "," + lat + "),4326)," + radius + "),geom);";
          console.log(queryStr);
          this.processQueryForMulti(queryStr, self.returnQueryResults);
        }

        
      }

      //  SELECT gid FROM public.bpd_arrests where extract(epoch from to_timestamp(concat(bpd_arrests.arrestdate,' ',bpd_arrests.arresttime), 'MM/DD/YYYY hh24:mi:ss')) > 1464430236;
      self.queryTableTime=function(name, timeStart, timeEnd){
        var tableName=DBConfig[name].tableName;

        if(tableName==null){
          return null
        }
        else{
          var queryStr="SELECT * FROM public.bpd_arrests where "+
          " extract(epoch from to_timestamp(concat(bpd_arrests.arrestdate,' ',bpd_arrests.arresttime), 'MM/DD/YYYY hh24:mi:ss')) > "+timeStart+
          " and extract(epoch from to_timestamp(concat(bpd_arrests.arrestdate,' ',bpd_arrests.arresttime), 'MM/DD/YYYY hh24:mi:ss'))<"+timeEnd+";";
          console.log(queryStr);
          this.processQueryForMulti(queryStr, self.returnQueryResults);
        }

        
      }

      self.returnQueryResult=function (err, result) {
          if(err){
            throw err;
          }

          //console.log(result.rows[0]); 
          var rows=result.rows;
          //console.log(rows);
          //return result.rows;
          if(rows.length<1||rows==null||rows===undefined){
            //no result found
            self.response.send({
              'result':'fail',
              'error message':'no result found'
            }) 
          }
          else if(rows.length>1){
            rself.response.send({
              'result':'fail',
              'error message':'more than one rows have been found, reported to database manager',
              'output':rows
            });
          }
          else{

            self['return'+self.tableName].apply(self,[rows[0]]);
          }

          self.client.end(function (err) {
            if (err) throw err;
          });
      }

      self.returnQueryResults=function (err, result) {
          if (err) throw err;

          //console.log(result.rows[0]); 
          var rows=result.rows;
          //console.log(rows);
          //return result.rows;
          if(rows.length<1||rows==null||rows===undefined){
            //no result found
            self.response.send({
              'result':'fail',
              'error message':'no result found'
            });
          }
          else{
            console.log('return'+self.tableName+'s');
            self['return'+self.tableName+'s'].apply(self,[rows]);
          }

          self.client.end(function (err) {
            if (err) throw err;
          });
      }

      self.queryArrest=function(geoTable, response){
        self.response=response;
        self.queryTable(geoTable.tableName,geoTable.queryId);
        //console.log(arguments);
      }

      self.returnArrest=function(row){
        var geometry=row.geojson;
        var arrest=new Arrest(geometry,null,{});
        arrest.loadFromDB(row);
        self.response.send(arrest.toJSON());
      }

      self.returnArrests=function(rows){
        var arrestArray=[];
        for(var i=0;i<rows.length;i++){
          var row=rows[i];
          console.log(row);
          var geometry=row.geojson;
          var arrest=new Arrest(geometry,null,{});
          arrest.loadFromDB(row);
          arrestArray.push(arrest.toJSON());

        }
        self.response.send(JSON.parse(JSON.stringify(arrestArray)));
      }

      self.queryArrestGeo=function(geoTable, lat, lng, radius, res){
        self.response=res;
        radius=radius/config_geo.DegToMeter;
        self.queryTableGeo(geoTable.tableName,lat, lng, radius);
        //console.log(arguments);
      }

      self.returnArrestGeo=function(row){
        var geometry=row.geojson;
        var arrest=new Arrest(geometry,null,{});
        arrest.loadFromDB(row);
        self.response.send(arrest.toJSON());
      }

      self.queryArrestTime=function(geoTable, timeStart, timeEnd, res){
        self.response=res;
        
        self.queryTableTime(geoTable.tableName,timeStart,timeEnd);
        //console.log(arguments);
      }

      self.returnArrestTime=function(row){
        var geometry=row.geojson;
        var arrest=new Arrest(geometry,null,{});
        arrest.loadFromDB(row);
        self.response.send(arrest.toJSON());
      }

  }

  exports.DBModule=DBModule;
  
}).call(this);

