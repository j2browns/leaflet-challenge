

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

d3.json(USGS_URL).then(function(response) {
    console.log(response.features)
    createFeatures(response.features);

});



function createFeatures(earthquakeData) {

  //color scale for depth of earquake
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  var earthquakes = L.geoJSON(earthquakeData, {
    
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
            //popup details
            // popUpDetails(feature), 
        });


    // function popUpDetails(feature) {
        earthquakes.eachLayer(function(layer) {
            var place = feature.properties.place;
            var date = new Date(feature.properties.time)
            var mag = feature.properties.mag;
            var popUp = "<h3>" + place +"</h3><hr><p>" + date + "<hr>"+mag+"</p>"
            layer.bindPopup(popUp, {offset: new L.Point(0, 5)});
    });

    // };
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};


//***********************Creating Map from Data********************* */
function createMap(earthquakes) {

  
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
 
 plateFile = "/static/js/tectonic_plates.json"
//   tectonic = L.geoJson(plateFile.responseJSON., {
//     style: {weight: 5,
//             opacity: 1, 
//             color: 'black',
//             fillOpacity: 1},
   
// });

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


//console.log(tectonic)
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plate": tectonic
    
  };
  
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap,  tectonic, earthquakes]
  });

  
  
  //Create a layer control
  //Pass in our baseMaps and overlayMaps
  //Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// tectonic.addTo(myMap);

  //Creating Legend based on color scale;
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    colorBounds = [5,10,15,20];    
    categories = [`0-${colorBounds[0]}`,`${colorBounds[0]}-${colorBounds[1]}`,`${colorBounds[1]}-${colorBounds[2]}`,`${colorBounds[2]}-${colorBounds[3]}`];
    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += "<p><strong>Earth Quake Depth</strong></p>"   
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < colorBounds.length; i++) {
          div.innerHTML +=
                '<i style="background:' + getFillColor(colorBounds[i]) + '"></i> ' +
                (categories[i]?categories[i]+'<br>': '+');
          }
    return div;
      
      };
  legend.addTo(myMap);

};