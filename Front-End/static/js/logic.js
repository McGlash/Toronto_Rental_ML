// Global Varables
var mainMapMaxZoom = 25;
var mainMapMinZoom = 12;
var TorontoMap; //Main map base
var rentalMarkerClusterGroup; //Main map rental markerClusterGroup
var crimeMap; // Crime Heatmap 
var communityMap; // Community Map 
var choroplethincomeMap; // choropleth Map income
var choroplethageMap; // choropleth Map age
var heatmapMarker; //heatmap marker
var communityMapMarker; //Community Map Rental Marker
var choroplethIncomeMapMarker; //choropleth Map Marker Income
var choroplethAgeMapMarker; //choropleth Map Marker Age
var curr_zoom=11;
var curr_zoom_comm=mainMapMinZoom;
var curr_zoom_income=curr_zoom;
var curr_zoom_age=curr_zoom;
var customCircleMarker = L.CircleMarker.extend({ 
  options: {     
    agency_name:"",        
    address:"", 
    category:"", 
    office_phone:"", 
    crisis_phone:"", 
    toll_free_phone:"", 
    e_mail:"", 
    fees:"", 
    service_name:"", 
    website:"", 
    url:"", 
    hours:"", 
    service_description:"", 
    eligibility:""          
  }
});
// Functions
function createBaseMap(){

  //function for styling FSA polygons
  function FSAStyle (feature) {
    return {
        fillColor: null,
        color: "grey",
        fillOpacity: 0
    };
  };

  // FSA Layer
  var FSA = new L.LayerGroup();
  d3.json(FSApath, function(data){
    L.geoJSON(data, {
      style: FSAStyle
    }).addTo(FSA)
  });

  // create tile layer
  var streetview = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: mainMapMaxZoom,
    minZoom: mainMapMinZoom,
    zoomOffset: -1,      
    id: "streets-v11",
    accessToken: API_KEY
  });


  // Create the map object with layers
  TorontoMap = L.map("map", {
    center: [43.72, -79.35],
    zoom: mainMapMinZoom,
    layers : [FSA, streetview]
  });

  //set limits on zoom
  TorontoMap.options.maxZoom = mainMapMaxZoom;
  TorontoMap.options.minZoom = mainMapMinZoom;

  return TorontoMap;
}

