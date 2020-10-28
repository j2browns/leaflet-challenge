# leaflet-challenge
Homework 17 - using Leaflet

This project is a demonstration of mapping using Leaflet.  The demonstration shows a map of North America with an overlay of earthquake data and tectonic boundary plate locations.

The earthquake data is provided by the USGS (https://earthquake.usgs.gov).  The tectonic plate data is taken from "https://github.com/fraxen/tectonicplates".  

Leaflet is used to generate the maps.  Data is brought in via d3 in order to read the json.  Two different versions of the map are provided - street style and a satellite view.  The user can select between the map types.  A minimum zoom level of 3 is set while the maximum is limited to 18.

For the earthquake data the size of the feature is scaled to the magnitude of the earthquake.  The color is an indication of depth of the earthquake.  The legend shows the scaling of the color.  A pop up is also provided for each earthquake feature (click activates).

The tectonic plates are shown in yellow lines.  Both the earthquake and tectonic plate data can be selected to show or hide the layer.

The view the map, run the index.html file in Live Server.  The final code is contained in logic.js.  The other files (logic_1 and logic_2) contain code that was used in the development and then moved to the logic.js file.  

