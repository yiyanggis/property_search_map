(function(){

  var GeoTable=require("./geoTable").GeoTable;
    /*
    * Desc: interface of Point Of Interest
    * params:
    * geometry: json format geometry of event
    * attributes: array of attributes
    */
  var GeoLoc = function(geometry,attributes) {
      var self = this;

      self.geometry=geometry;
      self.attributes=attributes;

  }

  GeoLoc.prototype = Object.create(GeoTable.prototype);

  GeoLoc.prototype.constructor = GeoLoc;

  exports.GeoLoc=GeoLoc;
  
}).call(this);

