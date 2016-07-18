(function(){
  var GeoLoc=require("./geoLoc").GeoLoc;

  /*
  * desc: inherit from geoLoc Class to represent Point Of Interest, map table city_market in postgresql
  * params:
  * geometry: json format geometry of event
  * attributes: array of attributes
  */
  var LiduorLic=function(geometry, name, attributes) {

      GeoLoc.call(this, geometry,attributes);

      var self = this;
      self.name=name;
  }

  LiduorLic.prototype = Object.create(GeoLoc.prototype);

  LiduorLic.prototype.constructor = LiduorLic;

  exports.LiduorLic=LiduorLic;
  
}).call(this);

