
var PriceMin="0";
var PriceMax="-1";
var FSA="";
var BedroomsMin="0";
var BedroomsMax="-1";

function createDropDown(data){

    //define parameters
    var selectedPriceMin="0";
    var selectedPriceMax="-1";
    var selectedFSA="";
    var selectedBedroomsMin="0";
    var selectedBedroomsMax="-1";

    //select dropdown menu for rental 
    var rentalPrice=[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]
    var dropDownMin= d3.select("#priceMin")
    dropDownMin.append("option").text("All Price");
    //give the dropdown id values
    rentalPrice.forEach(element => {
        dropDownMin.append("option").text(element);
    });
    //select dropdown menu for price 
    var dropDownMax= d3.select("#priceMax")
    dropDownMax.append("option").text("All Price");
    //give the dropdown id values
    rentalPrice.forEach(element => {
        dropDownMax.append("option").text(element);
    });
    //get no of bedrooms
    var bedrooms= data.map(d=> d.bedrooms);
    bedrooms=bedrooms.filter((item, i, ar) => ar.indexOf(item) === i);
    bedrooms= bedrooms.filter(d => +d).sort();
    var dropDownBedroomsMin= d3.select("#bedroomsMin")
    var dropDownBedroomsMax= d3.select("#bedroomsMax")
    dropDownBedroomsMin.append("option").text("All options");
    dropDownBedroomsMax.append("option").text("All options");
    //give the dropdow id values
    bedrooms.forEach(element => {
        dropDownBedroomsMin.append("option").text(element);
        dropDownBedroomsMax.append("option").text(element);
    });

    dataM = data.filter(d =>d.FSA.substring(0,1)=="M");
    uniqueFSA =  dataM.map(d => d.FSA).reverse();
    uniqueFSA = uniqueFSA.filter((item, i, ar) => ar.indexOf(item) === i).sort();
    var dropDownFSA= d3.select("#fsa_filter")
    dropDownFSA.append("option").text("All FSA");
    //give the dropdow id values
    uniqueFSA.forEach(element => {
            dropDownFSA.append("option").text(element);
    });

    //when dropdown changed save value
    dropDownMin.on("change", function(){
        var i= this.selectedIndex;
        selectedPriceMin= rentalPrice[i-1];
        if(i==0){
            selectedPriceMin="0";
        }
    });
    dropDownMax.on("change", function(){
        var i= this.selectedIndex;
        selectedPriceMax= rentalPrice[i-1];
        if(i==0){
            selectedPriceMax="-1";
        }
    });
    dropDownBedroomsMin.on("change", function(){
        var i= this.selectedIndex;
        selectedBedroomsMin= bedrooms[i-1];
        if(i==0){
            selectedBedroomsMin="0";
        }
    });
    dropDownBedroomsMax.on("change", function(){
        var i= this.selectedIndex;
        selectedBedroomsMax= bedrooms[i-1];
        if(i==0){
            selectedBedroomsMax="-1";
        }
    });
    
    dropDownFSA.on("change", function(){
        var i= this.selectedIndex;
        selectedFSA= FSA[i-1];
        if(i==0){
            selectedFSA="";
        }
    });

    //select button
    var button = d3.select("#submitFilter");
    button.on('click', function(){
        //construct the filtered url
        // var filteredUrl;
        if(selectedFSA==""){
            filteredURL= `availableRental?price=[${selectedPriceMin},${selectedPriceMax}]&bedrooms=[${selectedBedroomsMin},${selectedBedroomsMax}]`;
            
       
        }
        else{
            filteredURL= `availableRental?price=[${selectedPriceMin},${selectedPriceMax}]&bedrooms=[${selectedBedroomsMin},${selectedBedroomsMax}]&FSA=${selectedFSA}`;
            
        }
        //console.log(filteredURL);
        //get data from constructed url
        if(rentalMarkerClusterGroup){
            TorontoMap.removeLayer(rentalMarkerClusterGroup);
        }

        d3.json((baseUrl+filteredURL), function(rental){
            addRentalLayer(rental);
        });

        //Update global filter features for later use
        PriceMin = selectedPriceMin;
        PriceMax = selectedPriceMax;
        FSA = selectedFSA;
        BedroomsMin = selectedBedroomsMin;
        BedroomsMax = selectedBedroomsMax;
        

    }); 
}

function getFilterParm(){

    var filterParams =[];
    filterParams.push(PriceMin);
    filterParams.push(PriceMax);
    filterParams.push(FSA);
    filterParams.push(BedroomsMin);
    filterParams.push(BedroomsMax);
    return(filterParams);


}
