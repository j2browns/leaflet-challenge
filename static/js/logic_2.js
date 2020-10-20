

console.log("Checking Communications");

var USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
"2019-01-07&maxlongitude=-45.00&minlongitude=-165.00&maxlatitude=45.00&minlatitude=0";

function getFillColor(depth, colorBounds) {
    console.log(`${depth} which is ${typeof(depth)}`);
    switch(true) {
      case(depth <colorBounds[0]):
          color = "blue";
          return color;
      break; 
      case(depth <colorBounds[1]):
          color = "green";
          return color;
      break;
      case(depth <colorBounds[2]):
          color = "yellow";
          return color;
      break;
      case(depth <colorBounds[4]):
          color = "orange";
          return color;
      break;
      default:
          color = "red";
          return color;
      break;
    }

}


d3.json(USGS_URL).then(function(response) {
    console.log(response.features)
    createFeatures(response.features);

});



function createFeatures(earthquakeData) {

  //color scale for depth of earquake
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var colorBounds = [5,10,15,20]
  var earthquakes = L.geoJSON(earthquakeData, {
      
    pointToLayer: function(feature, latlng) {	
                const colorBounds = [5,10,15,20];
                return L.circleMarker(latlng, { 
        			 fillColor: getFillColor(feature.geometry.coordinates[2], colorBounds),
        			 color: 'black',
                     weight: 1, 
                     radius: feature.properties.mag*3,
        			 fillOpacity: 0.4 
        			    }).on({
                            mouseover: function(e) {
                                this.openPopup();
                                this.setStyle({weight: 2,
                                                fillOpacity:1});
                            },
                            mouseout: function(e) {
                                this.closePopup();
                                this.setStyle({weight: 1,
                                                fillOpacity:0.4});
                            },
                        })
            }
            //popup details
            //popUpDetails(feature);
        });


    function popUpDetails(feature) {
        earthquakes.eachLayer(function(layer) {
            var place = feature.properties.place;
            var date = new Date(feature.properties.time)
            var mag = feature.properties.mag;
            var popUp = "<h3>" + place +"</h3><hr><p>" + date + "<hr>"+mag+"</p>"
            layer.bindPopup(popUp, {offset: new L.Point(0, 5)});
    });

    };
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, colorBounds);
};

function createMap(earthquakes, colorBounds) {

  console.log(colorBounds);
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
 
  

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
    
  };
  
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });
 
  //Create a layer control
  //Pass in our baseMaps and overlayMaps
  //Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

grades = colorBounds;
console.log(`grades ${grades}`);
c = getFillColor(10,grades);
console.log(c);
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = colorBounds,
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getFillColor(grades[i] + 1, grades) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

};