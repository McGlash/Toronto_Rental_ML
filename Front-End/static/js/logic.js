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

// Function to update the rental Layer
function addRentalLayer(data){


  rentalData = data;

  //create rental posting layer
  var rentalMarkers = [];

  //function to determine text on rental icons
  function rentalText (text){
    return (text > 0)?parseInt(text):"?"
  };

  rentalDetails=[];
  rentalData.forEach(function(feature) {
  
    rental = L.ExtraMarkers.icon({
      markerColor: "green-light",
      svg: true,
      number: rentalText(feature.bedrooms),
      shape: 'circle',
      iconColor: "white",
      icon: 'fa-number', 
      image: feature.image,        
      furnished: feature.furnished, 
      pet_friendly: feature.pet_friendly, 
      title: feature.title, 
      price: feature.price, 
      rental_type: feature.rental_type, 
      url: feature.url, 
      postal_code: feature.postal_code, 
      post_published_date: feature.post_published_date, 
      description: feature.description,
      source: feature.source       
    });

    rentalMarkers.push(L.marker([feature.lat, feature.long], {
      icon: rental
    }).bindPopup(feature.title));
    rentalDetails.push(feature);
  });
  var rentalMarkerGroup = L.layerGroup(rentalMarkers);

  //Open sidebar when marker is clicked
  rentalMarkerGroup.getLayers().forEach(function(obj, i) { 
    obj.on('click', function(e){
      // marker clicked is e.target
      sidebar.open('rentalListing');
      displayRentalListing(e);
      // Heatmap marker
      if(heatmapMarker){
        curr_zoom = crimeMap.getZoom();
        crimeMap.removeLayer(heatmapMarker);
      }
      heatmapMarker = L.marker(e.target.getLatLng(), {
        icon: L.ExtraMarkers.icon({
          markerColor: "green-light",
          svg: true,
          number: e.target.options.icon.options.number,
          shape: 'circle',
          iconColor: "white",
          icon: 'fa-number',      
        })
      }).bindPopup(e.target.options.icon.options.title);
      heatmapMarker.addTo(crimeMap);
      crimeMap.setView(e.target.getLatLng(), curr_zoom);

      // Community Map marker
      if(communityMapMarker){
        curr_zoom_comm = communityMap.getZoom();
        communityMap.removeLayer(communityMapMarker);
      }
      communityMapMarker = L.marker(e.target.getLatLng(), {
        icon: L.ExtraMarkers.icon({
          markerColor: "green-light",
          svg: true,
          number: e.target.options.icon.options.number,
          shape: 'circle',
          iconColor: "white",
          icon: 'fa-number',      
        })
      }).bindPopup(e.target.options.icon.options.title);
      communityMapMarker.addTo(communityMap);
      communityMap.setView(e.target.getLatLng(), curr_zoom_comm);


      // Income Map marker
      if(choroplethIncomeMapMarker){
        curr_zoom_income = choroplethincomeMap.getZoom();
        choroplethincomeMap.removeLayer(choroplethIncomeMapMarker);
      }
      choroplethIncomeMapMarker = L.marker(e.target.getLatLng(), {
        icon: L.ExtraMarkers.icon({
          markerColor: "green-light",
          svg: true,
          number: e.target.options.icon.options.number,
          shape: 'circle',
          iconColor: "white",
          icon: 'fa-number',      
        })
      }).bindPopup(e.target.options.icon.options.title);
      choroplethIncomeMapMarker.addTo(choroplethincomeMap);
      choroplethincomeMap.setView(e.target.getLatLng(), curr_zoom_income);


      // Age Map marker
      if(choroplethAgeMapMarker){
        curr_zoom_age = choroplethageMap.getZoom();
        choroplethageMap.removeLayer(choroplethAgeMapMarker);
      }
      choroplethAgeMapMarker = L.marker(e.target.getLatLng(), {
        icon: L.ExtraMarkers.icon({
          markerColor: "green-light",
          svg: true,
          number: e.target.options.icon.options.number,
          shape: 'circle',
          iconColor: "white",
          icon: 'fa-number',      
        })
      }).bindPopup(e.target.options.icon.options.title);
      choroplethAgeMapMarker.addTo(choroplethageMap);
      choroplethageMap.setView(e.target.getLatLng(), curr_zoom_age);

    });
  });

  if(rentalMarkerClusterGroup){
    TorontoMap.removeLayer(rentalMarkerClusterGroup);
  }
  rentalMarkerClusterGroup = L.markerClusterGroup();
  rentalMarkerClusterGroup.addLayer(rentalMarkerGroup);
  rentalMarkerClusterGroup.addTo(TorontoMap);

  return rentalMarkerClusterGroup;
}

function createHeatmap(){

  // Function to map opacity based on MCI
  function findOpacity(MCI){

    switch(MCI) {
      case "Assault":
        return 0.7;
      case "Auto Theft":
          return 0.1;
      case "Homicide":
        return 0.9;
      case "Break and Enter":
        return 0.4;
      case "Robbery":
        return 0.4;
      case "Theft Over":
        return 0.1;
    }


  }

  crimeMap = L.map("crime-heatmap", {
    center: [43.728754, -79.388561],
    zoom: 11,
    minZoom: 9,
    maxZoom: mainMapMinZoom
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    minZoom: 9,
    maxZoom: 25,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(crimeMap);

  //var url = "http://127.0.0.1:5000/CrimeLastMonth";
  d3.json(url+"CrimeLastMonth", function(fullcrime){
    var heatArray = fullcrime.map(d=>[d.lat, d.long, findOpacity(d.MCI)]);
    var heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 35
    }).addTo(crimeMap);

  });
  return crimeMap;
}

