(function(){
  var GeoEvent=require("./geoEvent").GeoEvent;

  /*
  * desc: inherit from geoEvent Class to represent spatial-time event, map table bpd_arrest in postgresql
  * params:
  * geometry: json format geometry of event
  * time: time of event
  * attributes: array of attributes
  */
  var Arrest = function(geometry, time, attributes) {
      var self = this;

      GeoEvent.call(this,geometry, time, attributes);

      self.loadFromDB=function(row) {
        self.gid=row.gid;
        self.arrest=row.arrest;
        self.age=row.age;
        self.sex=row.sex;
        self.race=row.race;
        self.arrestdate=row.arrestdate;
        self.arresttime=row.arresttime;
        self.arrestloca=row.arrestloca;
        self.incidentof=row.incidentof;
        self.incidentlo=row.incidentlo;
        self.charge=row.charge;
        self.chargedesc=row.chargedesc;
        self.district=row.district;
        self.post=row.post;
        self.neighborho=row.neighborho;
        self.location=row['location 1'];
        self.lat=row.lat;
        self.lng=row.lng;
        self.geom=row.geom;
      }

      self.toJSON=function(){
        const json={
          'gid':self.gid,
          'arrest':self.arrest,
          'age':self.age,
          'sex':self.sex,
          'race':self.race,
          'arrestdate':self.arrestdate,
          'arresttime':self.arresttime,
          'arrestloca':self.arrestloca,
          'incidentof':self.incidentof,
          'incidentlo':self.incidentlo,
          'charge':self.charge,
          'chargedesc':self.chargedesc,
          'district':self.district,
          'post':self.post,
          'neighborho':self.neighborho,
          'location':self.location,
          'lat':self.lat,
          'lng':self.lng,
          'geo':self.geometry
        }

        return json;
      }

  }

  Arrest.prototype = Object.create(GeoEvent.prototype);

  Arrest.prototype.constructor = Arrest;

  exports.Arrest=Arrest;
  
}).call(this);

