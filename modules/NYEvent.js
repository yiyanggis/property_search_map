(function(){
  var GeoEvent=require("./geoEvent").GeoEvent;

  /*
  * desc: inherit from geoEvent Class to represent spatial-time event, map table bpd_arrest in postgresql
  * params:
  * geometry: json format geometry of event
  * time: time of event
  * attributes: array of attributes
  */
  var NYEvent = function(geometry, time, attributes) {
      var self = this;

      GeoEvent.call(this,geometry, time, attributes);

      self.loadFromDB=function(row) {

      }

  }

  NYEvent.prototype = Object.create(GeoEvent.prototype);

  NYEvent.prototype.constructor = NYEvent;

  exports.NYEvent=NYEvent;
  
}).call(this);

