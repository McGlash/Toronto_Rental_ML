// // API key
// const API_KEY = "pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ";

const API_KEY = "pk.eyJ1Ijoic29ncmEiLCJhIjoiY2tmNGZjbGgyMGNmNzJ6b2U4aGs1dWxzYSJ9.SwqmEkKR5PaW4UaQX-wFUg";
const url = "http://127.0.0.1:5000/";
var crimePath = `${url}crimeLastSixMonths`;
var baseUrl= url;
var availableRentalUrl= "availableRental";
var filteredUrl;
var communityUrl= "communityAssets";
// var crimePath = `${url}crimeLastSixMonths`;
var crimePath = `${url}CrimeLastThreeMonths`; //Used
var rentalPath = `${url}availableRental`; //Used
var incomeAgePath = `${url}fsaIncomeAge`;
var communityAssetpath = `${url}communityAssets`; //Used
var FSApath = "https://sogramemon.github.io/plotly-javascript-challenge/data/Toronto2.geojson"; //Used
var coming_soon = "../static/img/coming-soon-2461832_1280.jpeg";
var FSA_income_age_geojson = "static/js/fsa_income_age.geojson"
