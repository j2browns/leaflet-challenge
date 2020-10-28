console.log("Checking Communications");



function getFillColor(depth) {
    //console.log(`${depth} which is ${typeof(depth)}`);
    var colorBounds = [5,10,15,20]
    switch(true) {
      case(depth <colorBounds[0]):
          color = '#FED976';
          return color;
      break; 
      case(depth <colorBounds[1]):
          color = '#FD8D3C';
          return color;
      break;
      case(depth <colorBounds[2]):
          color = '#E31A1C';
          return color;
      break;
      case(depth <colorBounds[4]):
          color = '#800026';
          return color;
      break;
      default:
          color = "red";
          return color;
      break;
    }

}

var USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
"2019-01-07&maxlongitude=-45.00&minlongitude=-165.00&maxlatitude=45.00&minlatitude=0";

earthquake = new L.layerGroup();

d3.json(USGS_URL).then(function(response) {
    console.log(response.features)
    L.geoJson(response, {
        pointToLayer: function(feature, latlng) {	
                return L.circleMarker(latlng, { 
                   fillColor: getFillColor(feature.geometry.coordinates[2]),
                   color: 'black',
                   weight: 0.5, 
                   radius: feature.properties.mag*3,
                   fillOpacity: 1 
                      }).on({
                          mouseover: function(e) {
                              this.openPopup();
                              this.setStyle({weight: 2,
                                            fillColor: 'black',
                                              fillOpacity:1});
                          },
                          mouseout: function(e) {
                              this.closePopup();
                              this.setStyle({weight: 0.5,
                                              fillColor: getFillColor(feature.geometry.coordinates[2]),
                                              fillOpacity:1});
                          },
                      })
          }
          onEachFeature: function(feature, layer){
            var place = feature.properties.place;
            var date = new Date(feature.properties.time)
            var mag = feature.properties.mag;
            var popUp = "<h3>" + place +"</h3><hr><p>" + date + "<hr>"+mag+"</p>"
            layer.bindPopup(popUp, {offset: new L.Point(0, 5)});
          },
          interactive:true
         
      }).addTo(earthquake);
        
});

plateFile = "/static/js/tectonic_plates.json"
tectonic = new L.layerGroup();
d3.json(plateFile).then(function(response) {
    console.log(response.features);
    L.geoJson(response, {
      type: tectonic,
      style: {weight: 3,
              opacity: 1, 
               color: 'black'}
    }).addTo(tectonic)
});
