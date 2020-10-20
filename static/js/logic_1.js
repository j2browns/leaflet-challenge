console.log("Checking Communications");

  var USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
"2019-01-07&maxlongitude=-45.00&minlongitude=-165.00&maxlatitude=45.00&minlatitude=0";

  d3.json(USGS_URL).then(function(response) {
      console.log(response.features);
      ;
  
});





var cities = [
    {
      name: "New York",
      location: [40.7128, -74.0059],
      population: 8550405,
      radius: 20000,
      color: "blue"
    },
    {
      name: "Chicago",
      location: [41.8781, -87.6298],
      population: 2720546,
      radius: 40000,
      color: "red"
    },
    {
      name: "Houston",
      location: [29.7604, -95.3698],
      population: 2296224,
      radius: 70000,
      color: "white"
    },
    {
      name: "Los Angeles",
      location: [34.0522, -118.2437],
      population: 3971883,
      radius: 80000,
      color: "purple"
    },
    {
      name: "Omaha",
      location: [41.2524, -95.9980],
      population: 446599,
      radius: 30000,
      color: "orange"
    }
  ];
  

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
   
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap]
      });

      for (var i = 0; i < cities.length; i++) {
        L.circle(cities[i].location, {
          fillOpacity: 0.75,
          color: cities[i].color,
          fillColor: "purple",
          // Setting our circle's radius equal to the output of our markerSize function
          // This will make our marker's size proportionate to its population
          radius: cities[i].radius
        }).bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);
      }
      