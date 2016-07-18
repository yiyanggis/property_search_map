(function(){

    var GeoTable=require("./geoTable").GeoTable;
    /*
    * Desc: interface of spatial-time event
    * params:
    * geometry: json format geometry of event
    * time: time of event
    * attributes: array of attributes
    */
    var GeoEvent = function(geometry, time, attributes) {
      var self = this;

      self.geometry=geometry;
      self.time=time;
      self.attributes=attributes;

  }

  GeoEvent.prototype = Object.create(GeoTable.prototype);

  GeoEvent.prototype.constructor = GeoEvent;

  exports.GeoEvent=GeoEvent;
  
}).call(this);

