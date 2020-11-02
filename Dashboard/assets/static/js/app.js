//setup global variables

//all rental

var FSA = [];
var publishDate =[];
var bedroomNumber = [];
var averagePrice = [];

//overall

var onebed_overallPublishDate = [];
var onebed_overallAveragePrice = [];

var twobed_overallPublishDate = [];
var twobed_overallAveragePrice = [];

var threeplusbed_overallPublishDate = [];
var threeplusbed_overallAveragePrice = [];

var count = 0;
//create function to initialize dashboard

function init(){
    //read json file into js
    d3.json("static/data/rentalPrice.json").then(data => {

    console.log(data.bedrooms) 
          
    // create arrays
    Object.values(data.FSA).forEach(value => FSA.push(value));
    Object.values(data.post_published_date).forEach(value => publishDate.push(value));
    Object.values(data.bedrooms).forEach(value => bedroomNumber.push(value));
    Object.values(data.average_price).forEach(value => averagePrice.push(value));

    // console.log(bedroomNumber)

    //create arrays for toronto overall
    for (var i = 0; i < FSA.length; i++){
        
        if(FSA[i] == "Overall"){

            if(bedroomNumber[i] == 1){
                
                onebed_overallPublishDate.push(publishDate[i])
                onebed_overallAveragePrice.push(Math.round(averagePrice[i]))
            }
            else if(bedroomNumber[i] == 2){
                
                twobed_overallPublishDate.push(publishDate[i])
                twobed_overallAveragePrice.push(Math.round(averagePrice[i]))
            }
            else if (bedroomNumber[i] == "3 or More"){
                threeplusbed_overallPublishDate.push(publishDate[i])
                threeplusbed_overallAveragePrice.push(Math.round(averagePrice[i]))
            }
            else{};
        }
        else{};
    
    
    };
        //console.log(threeplusbed_overallAveragePrice)
        //console.log(threeplusbed_overallPublishDate)
    priceTrendChart(onebed_overallPublishDate, twobed_overallPublishDate, threeplusbed_overallPublishDate,
        onebed_overallAveragePrice, twobed_overallAveragePrice, threeplusbed_overallAveragePrice);
   
});


};

var FSAList =[];
var uniqueFSA =[];
var FSAFirstTwo =[];
var oneBedAvgFSA =[];
var twoBedAvgFSA =[];
var threeorMoreBedAvgFSA =[];


function priceTrendChart(x1, x2, x3, y1, y2, y3){

    //datasets
    var trace1 = {
        x: x1,
        y: y1,
        //mode: 'markers',
        name: 'One Bedroom',
        marker: {
          color: 'rgb(168, 9, 168)',
          size: 12,
          line: {
            color: 'white',
            width: 0.5
          }
        },
        type: 'scatter'
      };
      
      var trace2 = {
        x: x2,
        y: y2,
        //mode: 'markers',
        name: 'Two Bedroom',
        marker: {
          color: 'rgb(13, 117, 214)',
          size: 12
        },
        type: 'scatter'
      };
      
      var trace3 = {
        x: x3,
        y: y3,
        //mode: 'markers',
        name: 'Three or More Bedrooms',
        marker: {
          color: 'rgb(7, 161, 7)',
          size: 12
        },
        type: 'scatter'
      };
    //formatting
    var layout = {
        plot_bgcolor: 'rgba(245,246,249,1)',
        paper_bgcolor: 'rgba(245,246,249,1)',
        // title: { text:'Average Monthly Cost',
        // standoff: 20},
        font: {
          family: 'Arial',
          size: 15,
          color: '#7f7f7f'
        },
        xaxis: {
          title: {text:'Posting Date', 
          standoff: 20,},
          showgrid: false,
          zeroline: false,
        },
        yaxis: {
          title: {text: 'Average Cost',
          standoff: 15},
          showline: false,
          "gridcolor": "white"
        },legend: {
          x: 0.25,
          y: 1.1,
          "orientation": "h"

          }
        };

      var data = [trace1, trace2, trace3];
      
      Plotly.newPlot('chart', data, layout);
};

init();

//initFSA();
