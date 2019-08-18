// -------------------------------------------
// BUILD MAP LAYER
// -------------------------------------------

// create map object and set default layers
let myMap = L.map("map", {
  center: [ 37.09, -95.71],
  zoom: 4,
});

// definte tile layer
let streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// -------------------------------------------
// CREATE FUNCTIONS FOR MARKER STYLING
// -------------------------------------------

// funcation that sets a radius based on quake magnitude
function circleRadius(feature) {
  return (feature.properties.mag) * 5;
}

// function that sets a color based on quake magnitude
function circleColor(feature) {
  switch (true) {
    case (feature.properties.mag >= 5): return "darkred";
    break;
    case (feature.properties.mag >= 4): return "red";
    break;
    case (feature.properties.mag >= 3): return "orangered";
    break;
    case (feature.properties.mag >= 2): return "orange";
    break;
    default: return "yellow"}
  }

// -------------------------------------------
// GET DATA AND BUILD QUAKES LAYER FOR MARKERS
// -------------------------------------------

// set API endpoint to a variable
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  let quakes = L.geoJSON(data, {

    // create circle markers and place on each latlng
    pointToLayer: function (feature, latlng) {
      let geojsonMarkerOptions = {
        radius: 8,
        stroke: true,
        color: "black",
        // call circleRadius function to determine radius
        radius: circleRadius(feature),
        // call circleColor function to determine fill:
        fillColor: circleColor(feature),
        weight: 1,
        fillOpacity: 1
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },

    // add pop up info to each circle marker
    onEachFeature: function (feature, layer) {
      return layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.mag) + "</p>")
    }
  })
  
  // add quakes layer to map  
  quakes.addTo(myMap);
})
  