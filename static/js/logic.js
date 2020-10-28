console.log("Checking Communications");

//**************Homework Week 17 - Leaflet Mapping*********** */

//This assignment creates a map of the US showing two sets of GeoJSON data
//(earthquakes, tectonic plate locations)


//Function which defines the depth ranges and also the color 
function getFillColor(depth) {
    //console.log(`${depth} which is ${typeof(depth)}`);
    var colorBounds = [5,10,20,30];
    switch(true) {
      case(depth <colorBounds[0]):
          color = 'white';
          return color;
      break; 
      case(depth <colorBounds[1]):
          color = 'lightblue';
          return color;
      break;
      case(depth <colorBounds[2]):
          color = 'yellow';
          return color;
      break;
      case(depth <colorBounds[3]):
          color = 'red';
          return color;
      break;
      default:
          color = "darkblue";
          return color;
      break;
    }

}

//************************Defining Data Layers from GeoJSON Information************** */

// Getting GeoJSON data for earthquake data and creating layer earthquake
var USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
"2019-01-07&maxlongitude=-45.00&minlongitude=-165.00&maxlatitude=45.00&minlatitude=0";

earthquakes = new L.layerGroup();

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
                          click: function(e) {
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
          },
          onEachFeature: function(feature, layer){
            var place = feature.properties.place;
            var date = new Date(feature.properties.time)
            var mag = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            var popUp = "<h3>" + place +"</h3><hr><p>" + date + "<hr>Magnitude: "+mag+"<br>Depth: "+depth+" km</p>"
            layer.bindPopup(popUp, {offset: new L.Point(0, 5)});
          },
          interactive:true
         
      }).addTo(earthquakes);
        
});

// Getting GeoJSON data for tectonic plate data
plateFile = "/static/js/tectonic_plates.json"
tectonic = new L.layerGroup();
d3.json(plateFile).then(function(response) {
    console.log(response.features);
    L.geoJson(response, {
      type: tectonic,
      style: {weight: 3,
              opacity: 1, 
               color: 'yellow'},
        interactive:false //required to not have layer influence ability to select points from other layer
    }).addTo(tectonic)
});

//************************Creating Map Layers****************** */
// Define streetmap and satellite layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

   // Define a baseMaps object to hold our base layers
   var baseMaps = {
    "Street Map": streetmap,
    "Satellite": satellite
  };
 
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plate": tectonic
  };
  
  //Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    minZoom: 3,
    layers: [streetmap,  tectonic, earthquakes]
  });

  //Create a layer control
  //Pass in our baseMaps and overlayMaps
  //Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   //Creating Legend based on color scale;
   var legend = L.control({position: 'bottomright'});
   legend.onAdd = function () {
     colorBounds = [5,10,20,30];    
     colorBounds.push(40);
     console.log(colorBounds);
     categories = [`<${colorBounds[0]}`,`${colorBounds[0]}-${colorBounds[1]}`,`${colorBounds[1]}-${colorBounds[2]}`,`${colorBounds[2]}-${colorBounds[3]}`];
     var div = L.DomUtil.create('div', 'info legend');
         div.innerHTML += "<p><strong><center>Earth Quake Depth<br> (km)</center></strong></p>"   
         // loop through our density intervals and generate a label with a colored square for each interval
         for (var i = 0; i < colorBounds.length; i++) {
           div.innerHTML +=
                 '<i style="background:' + getFillColor(colorBounds[i]-1) + '"></i> ' +
                 (categories[i]?categories[i]+'<br>': '>max');
           }
     return div;
       
       };
   legend.addTo(myMap);