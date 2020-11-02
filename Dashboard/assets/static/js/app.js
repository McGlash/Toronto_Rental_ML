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


//create function to initialize rental trending

function rentalinit(){
    //read json file into js
    d3.json("static/data/rentalPrice.json").then(data => {
          
    // create arrays
    Object.values(data.FSA).forEach(value => FSA.push(value));
    Object.values(data.post_published_date).forEach(value => publishDate.push(value));
    Object.values(data.bedrooms).forEach(value => bedroomNumber.push(value));
    Object.values(data.average_price).forEach(value => averagePrice.push(value));

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

    priceTrendChart(onebed_overallPublishDate, twobed_overallPublishDate, threeplusbed_overallPublishDate,
        onebed_overallAveragePrice, twobed_overallAveragePrice, threeplusbed_overallAveragePrice);
   
});


};

var autoTheft = [];
var autoTheftDate =[];
var assault = [];
var assaulttDate =[];
var BreakandEnter = []; 
var BreakandEntertDate =[];
var robbery = []; 
var robberyDate = []; 

function crimeinit(){
  //read json file into js
  d3.json("static/data/crime.json").then(data => {
        
  // // create arrays
  data.forEach(item=> {
    
    if(item.reportedyear == '2019'){
    if(item.FSA == 'M6S'){
     if(item.MCI == 'Auto Theft'){
      
        autoTheft.push(item["Count of MCI"])
        autoTheftDate.push(item.reportedmonth)
      }
      else if(item.MCI == 'Assault'){
        
        assault.push(item["Count of MCI"])
        assaulttDate.push(item.reportedmonth)
      }
      else if(item.MCI == 'Break and Enter'){
        
        BreakandEnter.push(item["Count of MCI"])
        BreakandEntertDate.push(item.reportedmonth)
      }
      else if(item.MCI == 'Robbery'){
        robbery.push(item["Count of MCI"])
        robberyDate.push(item.reportedmonth)
      }
      else{};
    };
  };
  });
  for(var i = 0; i < newParamArr.length; i++)
{

    obj[newParamArr[i]] = paramVal[i];

  crimeTrendChart(autoTheftDate, assaulttDate, BreakandEntertDate, robberyDate, autoTheft, assault, BreakandEnter, robbery)

});


};


//rental chart
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
      margin: {
        t: 20,
        r: 20,
      },
        plot_bgcolor: 'rgba(245,246,249,1)',
        paper_bgcolor: 'rgba(245,246,249,1)',
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
      
      Plotly.newPlot('RentalChart', data, layout);
};

//crfimechart
function crimeTrendChart(x1, x2, x3, x4, y1, y2, y3, y4){

  //datasets
  var trace1 = {
      x: x1,
      y: y1,
      //mode: 'markers',
      name: 'Autotheft',
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
      name: 'Assault',
      marker: {
        color: 'rgb(13, 117, 214)',
        size: 12
      },
      type: 'scatter'
    };
    
    var trace3 = {
      x: x3,
      y: y3,
      name: 'Break and Enter',
      marker: {
        color: 'rgb(7, 161, 7)',
        size: 12
      },
      type: 'scatter'
    };

    var trace4 = {
      x: x4,
      y: y4,
      name: 'Robbery',
      marker: {
        color: 'rgb(7, 161, 7)',
        size: 12
      },
      type: 'scatter'
    };

  //formatting
  var layout = {
    margin: {
      t: 20,
      r: 20,
    },
      plot_bgcolor: 'rgba(245,246,249,1)',
      paper_bgcolor: 'rgba(245,246,249,1)',
      font: {
        family: 'Arial',
        size: 15,
        color: '#7f7f7f'
      },
      xaxis: {
        title: {text:'Month', 
        standoff: 20,},
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        title: {text: 'Number of Incidents',
        standoff: 15},
        showline: false,
        "gridcolor": "white"
      },legend: {
        x: 0.25,
        y: 1.1,
        "orientation": "h"

        }
      };

    var data = [trace1, trace2, trace3, trace4];
    
    Plotly.newPlot('CrimeChart', data, layout);
};
function init(){

  rentalinit();

  crimeinit();
}

init();

