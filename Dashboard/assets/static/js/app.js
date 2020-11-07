//setup global variables

var FSAList = ["All",'M1B','M1C','M1E','M1G','M1H','M1J','M1K','M1L','M1M','M1N','M1P','M1R','M1S','M1T','M1V','M1W','M1X',
'M2H','M2J','M2K','M2L','M2M','M2N','M2P','M2R',
'M3A','M3B','M3C','M3H','M3J','M3K','M3L','M3M','M3N',
'M4A','M4B','M4C','M4E','M4G','M4H','M4J','M4K','M4L','M4M','M4N','M4P','M4R','M4S','M4T','M4V','M4W','M4X','M4Y',
'M5A','M5B','M5C','M5E','M5G','M5H','M5J','M5M','M5N','M5P','M5R','M5S','M5T','M5V',
'M6A','M6B','M6C','M6E','M6G','M6H','M6J','M6K','M6L','M6M','M6N','M6P','M6R','M6S',
'M8V','M8W','M8X','M8Y','M8Z',
'M9A','M9B','M9C','M9L','M9M','M9N','M9P','M9R','M9V','M9W'];

var year =["2019", "2018", "2017"]

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

var sqft = [];
var price = [];
var bathrooms = [];
var bedrooms =[];


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

    d3.json("static/data/rentalTrend.json").then(data => {
      data.forEach(item =>{
        if((item.price <10000) & (item.price >200)){
          if(item.sqft <3000 & (item.sqft>200)){
            sqft.push(item.sqft)
            price.push(item.price)
            bathrooms.push(item.bathrooms)
            bedrooms.push(item.bedrooms)
          };
        };
      });

    priceVsChart(price, sqft, 'rgb(168, 9, 168)', "priceSqftChart", "Square-Footage")

    priceVsChart(price, bedrooms, 'rgb(168, 9, 168)', "priceBathroomsChart", "No. Bedrooms")

    });
   
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


  crimeTrendChart(autoTheft, assault, BreakandEnter, robbery);

});


};


//rental chart
function priceTrendChart(x1, x2, x3, y1, y2, y3){

    //datasets
    var trace1 = {
        x: x1,
        y: y1,
        //mode: 'markers',
        name: '1 Bedroom',
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
        name: '2 Bedrooms',
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
        name: '3 or More Bedrooms',
        marker: {
          color: 'rgb(7, 161, 7)',
          size: 12
        },
        type: 'scatter'
      };
    //formatting
    var layout = {     
      margin: {
      t: 15,
      r: 20,
    },
        plot_bgcolor: 'rgba(245,246,249,1)',
        paper_bgcolor: 'rgba(245,246,249,1)',
        font: {
          family: 'Arial',
          size: 13,
          color: '#7f7f7f'
        },
        xaxis: {
          title: {text:'Posting Date', 
          standoff: 15},
          showgrid: false,
          zeroline: false,
        },
        yaxis: {
          title: {text: 'Average Cost',
          standoff: 15},
          showline: false,
          "gridcolor": "white"
        },
        legend: {"orientation": "h",
        x: 0.1,
        y: 1.2,}
        };
      
      var config = {responsive: true}

      var data = [trace1, trace2, trace3];
      
      Plotly.newPlot('RentalChart', data, layout, config);
};

//crimechart
function crimeTrendChart(y1, y2, y3, y4){

  var labels =["Jan", "Feb", "Mar", "Apr",
               "May", "Jun", "Jul", "Aug", 
               "Sept", "Oct", "Nov", "Dec"]

  //datasets
  var trace1 = {
      x: labels,
      y: y1,
      name: 'Autotheft',
      marker: {
        color: 'rgb(168, 9, 168)',
        size: 12,
        line: {
          color: 'white',
          width: 0.5
        }
      },
      type: 'Scatter',
      mode: "lines"
    };
    
    var trace2 = {
      x: labels,
      y: y2,
      name: 'Assault',
      marker: {
        color: 'rgb(13, 117, 214)',
        size: 12
      },
      type: 'Scatter',
      mode: "lines"
    };
    
    var trace3 = {
      x: labels,
      y: y3,
      name: 'B & E',
      marker: {
        color: 'rgb(7, 161, 7)',
        size: 12
      },
      type: 'Scatter',
      mode: "lines"
    };

    var trace4 = {
      x: labels,
      y: y4,
      name: 'Robbery',
      marker: {
        color: '#FFCB25',
        size: 11
      },
      type: 'Scatter',
      mode: "lines"
    };

  //formatting
  var layout = {
    margin: {
      t: 15,
      r: 40,
    },
      plot_bgcolor: 'rgba(245,246,249,1)',
      paper_bgcolor: 'rgba(245,246,249,1)',
      font: {
        family: 'Arial',
        size: 13,
        color: '#7f7f7f'
      },
      xaxis: {
        title: {text:'Month', 
        standoff: 35},
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        title: {text: 'Number of Incidents',
        standoff: 15},
        showline: false,
        "gridcolor": "white"
      },
      legend: {"orientation": "h",
      x: 0.1,
      y: 1.2,}
      };
        
    var config = {responsive: true}

    var data = [trace1, trace2, trace3, trace4];
    
    Plotly.newPlot('CrimeChart', data, layout, config);
};

//price vs sqrt chart
function priceVsChart(price, y, color, chartID, ylabel){

  console.log(price)

  //datasets
  var trace1 = {
      x: price,
      y: y,
      marker: {
        color: color,
        size: 12,
        line: {
          color: 'white',
          width: 0.5
        }
      },
      type: 'Scatter',
      mode: 'markers'
    };

  //formatting
  var layout = {
    margin: {
      t: 15,
      r: 40,
    },
      plot_bgcolor: 'rgba(245,246,249,1)',
      paper_bgcolor: 'rgba(245,246,249,1)',
      font: {
        family: 'Arial',
        size: 13,
        color: '#7f7f7f'
      },
      xaxis: {
        title: {text:'Price', 
        standoff: 35},
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        title: {text: ylabel,
        standoff: 15},
        showline: false,
        "gridcolor": "white"
      }
      };
        
    var config = {responsive: true}
    
    Plotly.newPlot(chartID, [trace1], layout, config);
};

function init(){

  //FSA dropdown menu

  var dropdownMenuFSA = document.getElementById("selDatasetRental");
        for(var i = 0; i < FSAList.length; i++) {
            var newOption = document.createElement("option");
            // newOption.setAttribute("id","listFSA")
            var text = document.createTextNode(FSAList[i]);
            newOption.appendChild(text);
            dropdownMenuFSA.appendChild(newOption);
        };

        // var dropdownMenu = document.getElementById("selDatasetCrime");
        // for(var i = 0; i < year.length; i++) {
        //     var newOption = document.createElement("option");
        //     newOption.setAttribute("id","listCrime")
        //     var text = document.createTextNode(year[i]);
        //     newOption.appendChild(text);
        //     dropdownMenu.appendChild(newOption);
        // };
  rentalinit();

  crimeinit();
}

init();

