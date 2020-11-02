
//initial setup
  // select chart element
var Area = d3.select("#rental_cost_trends").select("svg");

  //setup element to hold chart
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
      top: 20,
      right: 40,
      bottom: 250,
      left: 250};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

  // Append group element > margins for within svg element
var chartGroup = svg.append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // setup x-axis labels
var xAxisLabel = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 60})`);

var povertyLabel = xAxisLabel.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") 
      .classed("active", true)
      .text("In Poverty (%)")
      .classed("aText", true);

var ageLabel = xAxisLabel.append("text")
      .attr("x", 0)
      .attr("y", 65)
      .attr("value", "age") 
      .classed("inactive", true)
      .text("Median Age")
      .classed("aText", true);
    
var incomeLabel = xAxisLabel.append("text")
      .attr("x", 0)
      .attr("y", 110)
      .attr("value", "income") 
      .classed("inactive", true)
      .text("Median Income (USD)")
      .classed("aText", true);
    
  // setup y-axis labels
var yAxisLabel = chartGroup.append("g")
            .attr("transform", "rotate(-90)");

var smokingLabel = yAxisLabel.append("text")
      .attr("x", -(height-margin.top)/2)
      .attr("y", -70)
      .attr("value", "smokes") 
      .classed("active", true)
      .text("Smokes (%)")
      .classed("aText", true);

var obesityLabel = yAxisLabel.append("text")
      .attr("x", - (height-margin.top)/2)
      .attr("y", -115)
      .attr("value", "obesity") 
      .classed("inactive", true)
      .text("Obese (%)")
      .classed("aText", true);

var healthLabel = yAxisLabel.append("text")
      .attr("x", -(height-margin.top)/2)
      .attr("y", -160)
      .attr("value", "healthcare") 
      .classed("inactive", true)
      .text("Lacks Healthcare Insurance (%)")
      .classed("aText", true);

//call chart function
chart();

//create chart function
function chart(){

  // Retrieve data from the CSV file
  d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // format the data
    data.forEach(d => {
      d.healthcare= +d.healthcare;
      d.poverty = +d.poverty;
      d.smokes = +d.smokes;
      d.age = +d.age;
      d.obesity = +d.obesity;
      d.income = +d.income;
    });

    // setup functions for scaling axes
    var xScale = d3.scaleLinear()
                        .domain([d3.min(data, d => d[xSelection])*0.75, d3.max(data, d => d[xSelection])*1.1])
                        .range([0, width]);

    var yScale = d3.scaleLinear()
                        .domain([d3.min(data, d => d[ySelection]) - 10, d3.max(data, d => d[ySelection]) + 10])
                        .range([height, 0])


    // setup axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // append axes
    xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

    xAxis.selectAll("text").classed("axes", true);

    yAxis = chartGroup.append("g")
    .call(leftAxis)

    yAxis.selectAll("text").classed("axes", true);

    // append circles and labels
    circlePlot = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[xSelection]))
      .attr("cy", d => yScale(d[ySelection]))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".5");
    
    circleLabels = chartGroup.append("g").selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text( d => d.abbr)
      .attr("x", d => xScale(d[xSelection]))
      .attr("y", d => yScale(d[ySelection])+3.5)
      .classed("stateText", true)

  // setup tooltip 
  
    //Initialize tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d =>`<strong>${d.state}<strong>
    <hr>${xSelection}: ${d[xSelection]}
    <hr>${ySelection}: ${d[ySelection]}`);


    //Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlePlot.on("mouseover", function(d) {
      toolTip.show(d, this);
    });
  // Create "mouseout" event listener to hide tooltip
    circlePlot.on("mouseout", function() {
      d3.select(".d3-tip")
      .transition()
        .delay(900)
        .duration(600)
        .style("opacity",0)
        .style('pointer-events', 'none')
      });
  });
};

// function used for updating xAxis based upon selection of label
function chartUpdatexAxis() {

  // Retrieve data from the CSV file
  d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // format the data
    data.forEach(d => {
      d.healthcare= +d.healthcare;
      d.poverty = +d.poverty;
      d.smokes = +d.smokes;
      d.age = +d.age;
      d.obesity = +d.obesity;
      d.income = +d.income;
    });

    // update scaling functions for axes
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xSelection])*0.95, d3.max(data, d => d[xSelection])*1.05])
        .range([0, width]);

    var bottomAxis = d3.axisBottom(xScale);

    // update x-axis
    xAxis.transition()
      .duration(1000)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    xAxis.selectAll("text").classed("axes", true);

    //update scatterplot
    circlePlot.transition()
      .duration(1000)
      .attr("cx", d => xScale(d[xSelection]));

    //update labels
    circleLabels.transition()
      .duration(1000)
      .attr("x", d => xScale(d[xSelection]));

    //Initialize tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d =>`<strong>${d.state}<strong>
    <hr>${xSelection}: ${d[xSelection]}
    <hr>${ySelection}: ${d[ySelection]}`);

    //Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlePlot.on("mouseover", function(d) {
      toolTip.show(d, this);
    });
    // Create "mouseout" event listener to hide tooltip
    circlePlot.on("mouseout", function(d) {
      toolTip.hide(d);
    });

    return circlePlot, xAxis, circleLabels, chartGroup;

    });
};

  // function used for updating yAxis based upon selection of label
function chartUpdateyAxis() {

  // Retrieve data from the CSV file
  d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // format the data
    data.forEach(d => {
      d.healthcare= +d.healthcare;
      d.poverty = +d.poverty;
      d.smokes = +d.smokes;
      d.age = +d.age;
      d.obesity = +d.obesity;
      d.income = +d.income;
    });

    // update scaling functions for axes
    var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[ySelection])*0.8, d3.max(data, d => d[ySelection])*1.1])
    .range([height, 0]);

    var leftAxis = d3.axisLeft(yScale);

    // update y-axis
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    yAxis.selectAll("text").classed("axes", true);

    //update scatterplot
    circlePlot.transition()
      .duration(1000)
      .attr("cy", d => yScale(d[ySelection]));

    //update labels
    circleLabels.transition()
      .duration(1000)
      .attr("y", d => yScale(d[ySelection]));

    //Initialize tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d =>`<strong>${d.state}<strong>
    <hr>${xSelection}: ${d[xSelection]}
    <hr>${ySelection}: ${d[ySelection]}`);


    //Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlePlot.on("mouseover", function(d) {
      toolTip.show(d, this);
    });
    // Create "mouseout" event listener to hide tooltip
    circlePlot.on("mouseout", function(d) {
      toolTip.hide(d);
    });
    
    return circlePlot, yAxis, circleLabels, chartGroup;

  });
};


// // x axis labels event listener
// xAxisLabel.selectAll("text")
// .on("click", function() {

//   // get value of selection
//   var xSelected = d3.select(this).attr("value");

//   if (xSelected !== xSelection) {

//     // replaces chosenXAxis with value
//     xSelection = xSelected;

//     // update chart
//     chartUpdatexAxis();

//     // changes classes of labels 
//     if (xSelection === "poverty") {
//       povertyLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       ageLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       incomeLabel
//         .classed("active", false)
//         .classed("inactive", true);
//     }
//     else if (xSelection === "income"){
//       povertyLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       ageLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       incomeLabel
//         .classed("active", true)
//         .classed("inactive", false);
//     }
//     else {
//       povertyLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       ageLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       incomeLabel
//         .classed("active", false)
//         .classed("inactive", true);
//   };

//   };

// });

// // y axis labels event listener
// yAxisLabel.selectAll("text")
// .on("click", function() {

//   // get value of selection
//   var ySelected = d3.select(this).attr("value");

//   if (ySelected !== ySelection) {

//     // replaces chosenXAxis with value
//     ySelection = ySelected;

//     //update chart
//     chartUpdateyAxis();

//     //changes classes of labels 
//     if (ySelection === "smokes") {
//       smokingLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       obesityLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       healthLabel
//         .classed("active", false)
//         .classed("inactive", true);
//     }
//     else if (ySelection === "obesity"){
//       smokingLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       obesityLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       healthLabel
//         .classed("active", false)
//         .classed("inactive", true);
//     }
//     else {
//       smokingLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       obesityLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       healthLabel
//         .classed("active", true)
//         .classed("inactive", false);
//   };

  // };
});



