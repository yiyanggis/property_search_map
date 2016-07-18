function AMLeafletMap(mapdiv) {
	
	var me = this;
	
	var $ = jQuery;

	var testAirspace;var testAirspace2;

	BASEMAP={
		STREET:null,
		TERRAIN:null,
		SATELLITE:null,
		HYBRID:null
	};

	var IMG_PATH = '/leaflet/js/images/';

	me.InitMap = function() {
		map = initmap(mapdiv);
		meMap = map;
		//canvas.trigger('map_init_done', [meMap]);
		//return meMap;
	};

	// for development only:
	me.getMap=function(){
		return meMap;
	}
	
	/*
	desc: 	initialize map div and setup layers
	parameter:
			{mapdiv}: map div name
	return value:
			{map}: the map global variable
	*/
	function initmap(mapdiv){

	
	    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';
	
		// BASEMAP={
		// 	STREET:null,
		// 	TERRAIN:null,
		// 	SATELLITE:null,
		// 	HYBRID:null};
	    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
		    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
		    Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {}),
		    googleSATELLITE=new L.Google(),
		    googleHybrid=new L.Google('HYBRID');

		BASEMAP.STREET=new L.Google('ROADMAP');
		BASEMAP.TERRAIN=new L.Google('TERRAIN');
		BASEMAP.SATELLITE=new L.Google();
		BASEMAP.HYBRID=new L.Google('HYBRID');
		
		var map = L.map(mapdiv, {
			zoomControl:false,
			doubleClickZoom:false,
			center: [43.7, -79.4],
			zoom: 10,
			layers: [BASEMAP.HYBRID]
		});

		L.control.zoom( {
			position:"topright"
		}).addTo(map);
				
		L.control.scale().addTo(map);
	
		//getLocation();

		//add test airspace
		map.setView([36,-121]);

	
		return map;
	}

	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(zoomToUserLoc);
	    } else {
	        
	    }
	}

	function zoomToUserLoc(position){
		console.log('zoomToUserLoc', position);
	
		map.panTo([position.coords.latitude,position.coords.longitude]);
	
		var marker=L.marker([position.coords.latitude,position.coords.longitude],{
					icon:L.icon({
					    iconUrl: IMG_PATH + 'home.png',
					    iconSize: [25, 25],
					    iconAnchor: [12, 12],
					    popupAnchor: [0, -10]
					    //shadowUrl: 'my-icon-shadow.png',
					    //shadowRetinaUrl: 'my-icon-shadow@2x.png',
					    //shadowSize: [68, 95],
					    //shadowAnchor: [22, 94]
					})
				}).bindPopup("Your home location (not accurate)");
				marker.addTo(map);

		map.invalidateSize();
	}


}