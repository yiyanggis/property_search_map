(function(){
    /*
    * Desc: abstract interface of table object
    * params:
    * tableName: name of table
    */
  var GeoTable = function(tableName) {
      var self = this;

      self.tableName=tableName;

      self.isGeo=true;

      self.setQueryID=function(id){
        self.queryId=id;
      }

      //
      self.getData=function(id){
        console.log("use id:"+id+" to query table "+self.tableName);
      }

      self.loadFromDB=function(row){

      }

  }

  exports.GeoTable=GeoTable;
  
}).call(this);

