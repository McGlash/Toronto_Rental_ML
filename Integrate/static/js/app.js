//setup global variables

var datePosted = [];
var monthDayPosted = []; 
var uniqueDate =[];
var oneBedAvg = [];
var twoBedAvg =[];
var threeorMoreBedAvg =[];
var dates =[];

//create sum function
function average(array){
    var total = 0; 
    var length =0;
    for(var i = 0; i < array.length; i++) { 
      if(array[i] > 0 && array[i] < 15000 ){
        total += array[i];
        length += 1;
      }
      else{};
    };
    var average = total/length;

    return average
};

//create function to initialize dashboard

function init(){
    //read json file into js
    d3.json(baseUrl+availableRentalUrl, function(data) {

        //determine dates
        data.forEach(posting=> {
            
        datePosted.push(posting.post_published_date)
            });

        uniqueDate = [...new Set(datePosted)];

        uniqueDate.sort();

        for (var i = 20; i < uniqueDate.length; i++){

            var oneBedroom = [];
            var twoBedroom = [];
            var threeorMoreBedroom = [];

            data.forEach(posting => {

                if(posting.post_published_date == uniqueDate[i]){

                    if (posting.bedrooms == 1){
                        oneBedroom.push(parseInt(posting.price));
                    }
                    else if(posting.bedrooms == 2){
                        twoBedroom.push(parseInt(posting.price));
                    }
                    else if(posting.bedrooms > 2 && posting.bedrooms < 10){
                        threeorMoreBedroom.push(parseInt(posting.price));
                    }
                    else{

                    }
                }
                else{}
            });

            dates.push(uniqueDate[i])
            oneBedAvg.push(parseInt(average(oneBedroom)));
            twoBedAvg.push(parseInt(average(twoBedroom)));
            threeorMoreBedAvg.push(parseInt(average(threeorMoreBedroom)));
        };

        //setup plot

        var trace1 = {
            x: dates,
            y: oneBedAvg,
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
            x: dates,
            y: twoBedAvg,
            //mode: 'markers',
            name: 'Two Bedroom',
            marker: {
              color: 'rgb(13, 117, 214)',
              size: 12
            },
            type: 'scatter'
          };
          
          var trace3 = {
            x: dates,
            y: threeorMoreBedAvg,
            //mode: 'markers',
            name: 'Three or More Bedrooms',
            marker: {
              color: 'rgb(7, 161, 7)',
              size: 12
            },
            type: 'scatter'
          };
       
          var data = [trace1, trace2, trace3];

          //formatting
          var layout = {
            width: 450,
            height: 450, 
            title: 'Average Monthly Cost',
            xaxis: {
              title: 'Date',
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              title: 'Average Cost',
              showline: false
            },legend: {
                x: 0.7,
                y: -0.5
              }

          };
          

          //plot chart
          Plotly.newPlot('line_rentTime', data, layout, {responsive: true});
    });
};

var FSAList =[];
var uniqueFSA =[];
var FSAFirstTwo =[];
var oneBedAvgFSA =[];
var twoBedAvgFSA =[];
var threeorMoreBedAvgFSA =[];

//create function to initialize dashboard

function initFSA(){
  //read json file into js
  d3.json(baseUrl+availableRentalUrl, function(data) {

      //determine dates
      data.forEach(posting=> {

        var holder = posting.FSA;
        var eval = holder.substring(0,1);

        if (eval == "M"){
        FSAList.push(posting.FSA)
        };
 
          });
      
        for (var i = 0; i < FSAList.length; i++){
          
          var holder = FSAList[i].substring(0,2)

          FSAFirstTwo.push(holder)
          
        };
      uniqueFSA = [...new Set(FSAFirstTwo)];

      uniqueFSA.sort()

      //console.log(uniqueFSA)

      for (var i = 0; i < uniqueFSA.length; i++){

          var oneBedroom = [];
          var twoBedroom = [];
          var threeorMoreBedroom = [];

          data.forEach(posting => {

            var holder = posting.FSA
            var eval = holder.substring(0,2);

              if(eval == uniqueFSA[i]){

                  if (posting.bedrooms == 1){
                      oneBedroom.push(parseInt(posting.price));
                  }
                  else if(posting.bedrooms == 2){
                      twoBedroom.push(parseInt(posting.price));
                  }
                  else if(posting.bedrooms > 2 && posting.bedrooms < 10){
                      threeorMoreBedroom.push(parseInt(posting.price));
                  }
                  else{

                  }
              }
              else{}
          });

          // console.log(uniqueFSA.length)
          oneBedAvgFSA.push(parseInt(average(oneBedroom)));
          twoBedAvgFSA.push(parseInt(average(twoBedroom)));
          threeorMoreBedAvgFSA.push(parseInt(average(threeorMoreBedroom)));
      };

//       //setup plot
      var data = [{
        type: 'bar',
        x: oneBedAvgFSA,
        y: uniqueFSA,
        orientation: 'h',
        marker: {
          color: 'rgb(168, 9, 168)'
        }
      }];

      var layout = {
        width: 450,
        height: 450, 
        title: 'Average Cost to Rent One Bedroom',
        showlegend: false,
        xaxis: {
          title: 'Average Cost'
        },
        yaxis: {
          title: 'First Two Digits of Postal Code', 
          zeroline: false,
          gridwidth: 2
        },
        bargap :0.05
      };

//         //plot chart
        Plotly.newPlot("bar_rentAvgIncome", data, layout);
  });
};

init();

initFSA();

//setup global variables

var FSAList = ["Overall",'M1B','M1C','M1E','M1G','M1H','M1J','M1K','M1L','M1M','M1N','M1P','M1R','M1S','M1T','M1V','M1W','M1X',
'M2H','M2J','M2K','M2L','M2M','M2N','M2P','M2R',
'M3A','M3B','M3C','M3H','M3J','M3K','M3L','M3M','M3N',
'M4A','M4B','M4C','M4E','M4G','M4H','M4J','M4K','M4L','M4M','M4N','M4P','M4R','M4S','M4T','M4V','M4W','M4X','M4Y',
'M5A','M5B','M5C','M5E','M5G','M5H','M5J','M5M','M5N','M5P','M5R','M5S','M5T','M5V',
'M6A','M6B','M6C','M6E','M6G','M6H','M6J','M6K','M6L','M6M','M6N','M6P','M6R','M6S',
'M8V','M8W','M8X','M8Y','M8Z',
'M9A','M9B','M9C','M9L','M9M','M9N','M9P','M9R','M9V','M9W'];

//var year =["2019", "2018", "2017"]

//all rental

var FSA = [];
var publishDate =[];
var bedroomNumber = [];
var averagePrice = [];

//create function to initialize rental trending

function rental(filter){

        //read json file into js; //http://127.0.0.1:5000/agg/rentalPriceAggregate
    d3.json(url+"rentalPriceAggregate").then(data => { 

    // create arrays

    var array =[];

    data.forEach(row => {
      FSA.push(row.FSA);
      publishDate.push(row.post_published_date)
      bedroomNumber.push(row.bedrooms);
      averagePrice.push(row.average_price);
    });

      var onebed_PublishDate = [];
      var onebed_AveragePrice = [];

      var twobed_PublishDate = [];
      var twobed_AveragePrice = [];

      var threeplusbed_PublishDate = [];
      var threeplusbed_AveragePrice = [];

    // Object.values(data.FSA).forEach(value => FSA.push(value));
    // Object.values(data.post_published_date).forEach(value => publishDate.push(value));
    // Object.values(data.bedrooms).forEach(value => bedroomNumber.push(value));
    // Object.values(data.average_price).forEach(value => averagePrice.push(value));

    //create arrays for toronto overall
    for (var i = 0; i < FSA.length; i++){
        
        if(FSA[i] == filter){

            if(bedroomNumber[i] == 1){
                
                onebed_PublishDate.push(new Date(publishDate[i]))
                onebed_AveragePrice.push(Math.round(averagePrice[i]))
            }
            else if(bedroomNumber[i] == 2){
                
                twobed_PublishDate.push(new Date(publishDate[i]))
                twobed_AveragePrice.push(Math.round(averagePrice[i]))
            }
            else if (bedroomNumber[i] == "3 or More"){
                threeplusbed_PublishDate.push(new Date(publishDate[i]))
                threeplusbed_AveragePrice.push(Math.round(averagePrice[i]))
            }
            else{};
        }
        else{}; 
    };

    priceTrendChart(onebed_PublishDate, twobed_PublishDate, threeplusbed_PublishDate,
        onebed_AveragePrice, twobed_AveragePrice, threeplusbed_AveragePrice)
   
  });
};

//global variables for drivers

  //arrays
var Measure = [];
var cluster = [];
var measureValue = [];
var avgPrice = [];

  //driver variables
var sqft = [];
var price = [];

var bedroomsOV =[];
var bedAvgPriceOV = [];

// var bedroomsCL1 =[];
// var bedAvgPriceCL1 = [];

// var bedroomsCL2 =[];
// var bedAvgPriceCL2 = [];

// var bedroomsCL3 =[];
// var bedAvgPriceCL3 = [];

var bathroomsOV = [];
var bathAvgPriceOV = [];

// var bathroomsCL1 = [];
// var bathAvgPriceCL1 = [];

// var bathroomsCL2 = [];
// var bathAvgPriceCL2 = [];

// var bathroomsCL3 = [];
// var bathAvgPriceCL3 = [];

var petsOV = [];
var petsAvgPriceOV = [];

// var petsCL1 = [];
// var petsAvgPriceCL1 = [];

// var petsCL2 = [];
// var petsAvgPriceCL2 = [];

// var petsCL3 = [];
// var petsAvgPriceCL3 = [];

var typeOV = [];
var typeAvgPriceOV = [];

// var typeCL1 = [];
// var typeAvgPriceCL1 = [];

// var typeCL2 = [];
// var typeAvgPriceCL2 = [];

// var typeCL3 = [];
// var typeAvgPriceCL3 = [];

var furnOV = [];
var furnAvgPriceOV = [];

// var furnCL1 = [];
// var furnAvgPriceCL1 = [];

// var furnCL2 = [];
// var furnAvgPriceCL2 = [];

// var furnCL3 = [];
// var furnAvgPriceCL3 = [];


function drivers(){
  //http://127.0.0.1:5000/rentalTrend
    d3.json(url+"rentalTrend").then(data => {
     
      data.forEach(item =>{
        if((item.price <10000) & (item.price >200)){
          if(item.sqft <3000 & (item.sqft>200)){
            sqft.push(item.sqft)
            price.push(item.price)
          };
        };
      });

    priceVsChart(price, sqft, 'rgb(168, 9, 168)', "priceSqftChart", "Square-Footage")

    });

    //http://127.0.0.1:5000/agg/clusterPriceAggregate
    d3.json(url+"agg/clusterPriceAggregate").then(data => {

      Object.values(data.Measure).forEach(value => Measure.push(value));
      Object.values(data.cluster).forEach(value => cluster.push(value));
      Object.values(data.measure_value).forEach(value => measureValue.push(value));
      Object.values(data.price).forEach(value => avgPrice.push(value));

      for (var i = 0; i < Measure.length; i++){

        if(Measure[i] == "No_Bedrooms"){
          if((cluster[i]== "overall")&(measureValue[i]<6)){
            bedroomsOV.push(measureValue[i])
            bedAvgPriceOV.push(avgPrice[i].toFixed(0))
          }
          // else if ((cluster[i]== 0)&(measureValue[i]<6)){
          //   bedroomsCL1.push(measureValue[i])
          //   bedAvgPriceCL1.push(avgPrice[i].toFixed(0))
          // }
          // else if((cluster[i] == 1)&(measureValue[i]<6)){
          //   bedroomsCL2.push(measureValue[i])
          //   bedAvgPriceCL2.push(avgPrice[i].toFixed(0))
          // }
          // else if((cluster[i] == 2)&(measureValue[i]<6)){
          //   bedroomsCL3.push(measureValue[i])
          //   bedAvgPriceCL3.push(avgPrice[i].toFixed(0))
          // }
          else{};
        }
        else if(Measure[i] == "No_Bathrooms"){
          if((cluster[i]== "overall")&(measureValue[i]<3.5)&(measureValue[i]>0)){
            bathroomsOV.push(measureValue[i])
            bathAvgPriceOV.push(avgPrice[i].toFixed(0))
          }
          // else if ((cluster[i]== 0)&(measureValue[i]<3.5)&(measureValue[i]>0)){
          //   bathroomsCL1.push(measureValue[i])
          //   bathAvgPriceCL1.push(avgPrice[i].toFixed(0))
          // }
          // else if ((cluster[i] == 1)&(measureValue[i]<3.5)&(measureValue[i]>0)){
          //   bathroomsCL2.push(measureValue[i])
          //   bathAvgPriceCL2.push(avgPrice[i].toFixed(0))
          // }
          // else if((cluster[i] == 2)&(measureValue[i]<3.5)&(measureValue[i]>0)){
          //   bathroomsCL3.push(measureValue[i])
          //   bathAvgPriceCL3.push(avgPrice[i].toFixed(0))
          // }
          else{};
        }
          // else if (Measure[i] == "pets"){
          //   if(cluster[i]== "overall"){
          //     petsOV.push(measureValue[i])
          //     petsAvgPriceOV.push(avgPrice[i].toFixed(0))
          //   }
          //   else if (cluster[i]== 0){
          //     petsCL1.push(measureValue[i])
          //     petsAvgPriceCL1.push(avgPrice[i].toFixed(0))
          //   }
          //   else if(cluster[i] == 1){
          //     petsCL2.push(measureValue[i])
          //     petsAvgPriceCL2.push(avgPrice[i].toFixed(0))
          //   }
          //   else if(cluster[i] == 2){
          //     petsCL3.push(measureValue[i])
          //     petsAvgPriceCL3.push(avgPrice[i].toFixed(0))
          //   }
          //   else{};
          // }
            else if (Measure[i] == "rental_type"){
              if(cluster[i]== "overall"){
                typeOV.push(measureValue[i])
                typeAvgPriceOV.push(avgPrice[i].toFixed(0))
              }
          //     else if (cluster[i]== 0){
          //       typeCL1.push(measureValue[i])
          //       typeAvgPriceCL1.push(avgPrice[i].toFixed(0))
          //     }
          //     else if(cluster[i] == 1){
          //       typeCL2.push(measureValue[i])
          //       typeAvgPriceCL2.push(avgPrice[i].toFixed(0))
          //     }
          //     else if(cluster[i] == 2){
          //       typeCL3.push(measureValue[i])
          //       typeAvgPriceCL3.push(avgPrice[i].toFixed(0))
          //     }
              else{};
          }
          // else if (Measure[i] == "Furnished"){
          //   if(cluster[i]== "overall"){
          //     furnOV.push(measureValue[i])
          //     furnAvgPriceOV.push(avgPrice[i].toFixed(0))
          //   }
            // else if (cluster[i]== 0){
            //   furnCL1.push(measureValue[i])
            //   furnAvgPriceCL1.push(avgPrice[i].toFixed(0))
            // }
            // else if(cluster[i] == 1){
            //   furnCL2.push(measureValue[i])
            //   furnAvgPriceCL2.push(avgPrice[i].toFixed(0))
            // }
            // else if(cluster[i] == 2){
            //   furnCL3.push(measureValue[i])
            //   furnAvgPriceCL3.push(avgPrice[i].toFixed(0))
            // }
        //     else{};
        // }
          else{};
        };
    

     // };

      barchart(bedroomsOV, bedAvgPriceOV, "Overall", bedroomChart, "No. of Bedrooms"); 
      // bedroomsCL1, bedAvgPriceCL1, "Cluster 1", bedroomsCL2, bedAvgPriceCL2, "Cluster 2", bedroomsCL3, bedAvgPriceCL3, "Cluster 3", bedroomChart, "No. of Bedrooms");

      barchart(bathroomsOV, bathAvgPriceOV, "Overall", bathroomChart, "No. of Bathrooms");
      //bathroomsCL1, bathAvgPriceCL1, "Cluster 1", bathroomsCL2, bathAvgPriceCL2, "Cluster 2", bathroomsCL3, bathAvgPriceCL3, "Cluster 3", bathroomChart, "No. of Bathrooms");

      //  barchart(petsOV, petsAvgPriceOV, "Overall", petsCL1, petsAvgPriceCL1, "Cluster 1",
      //  petsCL2, petsAvgPriceCL2, "Cluster 2", petsCL3, petsAvgPriceCL3, "Cluster 3", petChart, "Allow Pets");

       barchart(typeOV, typeAvgPriceOV, "Overall", typeChart, "Rental Type");
      // typeCL1, typeAvgPriceCL1, "Cluster 1", typeCL2, typeAvgPriceCL2, "Cluster 2", typeCL3, typeAvgPriceCL3, "Cluster 3", typeChart, "Rental Type");

      //  barchart(furnOV, furnAvgPriceOV, "Overall", furnCL1, furnAvgPriceCL1, "Cluster 1",
      //  furnCL2, furnAvgPriceCL2, "Cluster 2", furnCL3, furnAvgPriceCL3, "Cluster 3", furnChart, "Furnishing provided");
    });
};


function crime(filter, year){
  //read json file into js
  //http://127.0.0.1:5000/agg/crime

  var autoTheft = [];
  var autoTheftDate =[];
  var assault = [];
  var assaulttDate =[];
  var BreakandEnter = []; 
  var BreakandEntertDate =[];
  var robbery = []; 
  var robberyDate = []; 

  d3.json(url+"agg/crime").then(data => {
        
  // // create arrays
  data.forEach(item=> {
    
    if(item.reportedyear == year){
    if(item.FSA == filter){
    
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

  console.log(x1)
  console.log(y1)

    //datasets
    var trace1 = {
        x: x1,
        y: y1,
        name: '1 Bedroom',
        marker: {
          color: 'rgb(168, 9, 168)',
          size: 7,
          line: {
            color: 'white',
            width: 0.5
          }
        },
        type: 'scatter',
        mode: 'lines+markers'
      };
      
      var trace2 = {
        x: x2,
        y: y2,
        name: '2 Bedrooms',
        marker: {
          color: 'rgb(13, 117, 214)',
          size: 7
        },
        type: 'scatter',
        mode: 'lines+markers'

      };
      
      var trace3 = {
        x: x3,
        y: y3,
        name: '3 or More Bedrooms',
        marker: {
          color: 'rgb(7, 161, 7)',
          size: 7
        },
        type: 'scatter',
        mode: 'lines+markers'
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
        size: 10
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
        size: 10
      },
      type: 'Scatter',
      mode: "lines"
    };

    var trace4 = {
      x: labels,
      y: y4,
      name: 'Robbery',
      marker: {
        color: 'rgb(197, 90, 17)',
        size: 10
      },
      type: 'Scatter',
      mode: "lines"
    };

  //formatting
  var layout = {
    margin: {
      t: 20,
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
      mode: 'markers',
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
    };

  //formatting
  var layout = {
    margin: {
      t: 40,
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

//x2, y2, name2, x3, y3, name3, x4, y4, name4,

function barchart(x1, y1, name1, chart, ylabel){

  var trace1 = {
    x: x1,
    y: y1,
    name: name1,
    type: 'bar',   
    marker: {
      color: 'rgb(0, 176, 80)'
    },
    text: y1.map(String),
    textposition: 'auto',
    hoverinfo: 'none'

  };
  
  // var trace2 = {
  //   x: x2,
  //   y: y2,
  //   name: name2,
  //   type: 'bar',
  //   marker: {
  //     color: 'rgb(13, 117, 214)'
  //   },
  //   text: y2.map(String),
  //   textposition: 'auto',
  //   hoverinfo: 'none'
  // };

  // var trace3 = {
  //   x: x3,
  //   y: y3,
  //   name: name3,
  //   type: 'bar',
  //   marker: {
  //     color: 'rgb(168, 9, 168)'
  //   },
  //   text: y3.map(String),
  //   textposition: 'auto',
  //   hoverinfo: 'none'
  // };
  
  // var trace4 = {
  //   x: x4,
  //   y: y4,
  //   name: name4,
  //   type: 'bar',
  //   marker: {
  //     color: 'rgb(197, 90, 17)'
  //   },
  //   text: y4.map(String),
  //   textposition: 'auto',
  //   hoverinfo: 'none'
  // };

  var data =[trace1]
  
  //var data = [trace1, trace2, trace3, trace4];
  
  var layout = {barmode: 'group'};

  var layout = {
    margin: {
      t: 40,
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
        title: {text: ylabel, 
        standoff: 35},
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        title: {text: 'Average Price (CAD)',
        standoff: 15},
        showline: false,
        "gridcolor": "white"
      }
      };

      var config = {responsive: true}
  
  Plotly.newPlot(chart, data, layout, config);
};

function init(){

  //FSA dropdown menu

  var dropdownMenuFSA = document.getElementById("selDataset");
        for(var i = 0; i < FSAList.length; i++) {
            var newOption = document.createElement("option");
            newOption.setAttribute("id","listFSA")
            var text = document.createTextNode(FSAList[i]);
            newOption.appendChild(text);
            dropdownMenuFSA.appendChild(newOption);
        };

  rental("Overall");

  crime("Overall", "2019");

  drivers();
};

init();


//onChang function

function optionChanged(){

  //get the FSA selected
  var dropdownMenu = d3.select("#selDataset");
  var selected = dropdownMenu.property("value")

 // Plotly.purge('RentalChart');

  // var element = document.getElementById("RentalChart");
  // element.classList.remove("js-plotly-plot");

  rental(selected);
  crime(selected, "2019");

};