
c
function displayRentalListing(element){
    if(element.target.options.icon.options.image != null && ((typeof element.target.options.icon.options.image) == "string") && (element.target.options.icon.options.image.length > 10)){
        d3.select("#rentalListingImg").attr("src", element.target.options.icon.options.image);
    }else{
        d3.select("#rentalListingImg").attr("src", coming_soon);
    }
    //clear previous
    var furnished = "No";
    var petFriendly = "No";
    if(element.target.options.icon.options.furnished){
        furnished="Yes"
    }
    if(element.target.options.icon.options.pet_friendly){
        petFriendly="Yes"
    }
    // Check the price
    var statement;
    var pred_val = parseFloat(element.target.options.icon.options.pred);
    var actual_price = parseFloat(element.target.options.icon.options.price);
    if(! isNaN(pred_val)){
        var lb = Number.parseFloat(element.target.options.icon.options.pred) - 453.58;
        var ub = Number.parseFloat(element.target.options.icon.options.pred) + 453.58;
        if(! isNaN(actual_price)){
            if((actual_price>=lb) && (actual_price<=ub)){
                statement = `<span style="color:blue">Price is within limits of our estimated Price range : ${pred_val.toFixed(0)} \u00B1 453</span>` ;
            }
            else if(actual_price<lb){
                statement = `<span style="color:green">It is a great deal!! Price is lower than our estimated Price range : ${pred_val.toFixed(0)} \u00B1 453</span>` ;
            }
            else{
                statement = `<span style="color:red">It is overpriced!! Price is higher than our estimated Price range : ${pred_val.toFixed(0)} \u00B1 453</span>` ;
            }
        }else{
            statement = `<span style="color:blue">Rental post doesn't have listed price. Our estimated Price for this rental is ${pred_val.toFixed(0)} \u00B1 453</span>` ;
        }
    }else{
        statement = `<span style="color:black">The given information in the rental post is not enough to estimate the price</span>`;
    }
    
     
    d3.selectAll("#rentalInfo").html("");
    d3.selectAll("#rentalInfo").append("h3").text(element.target.options.icon.options.title).classed('card-title', true);
    d3.selectAll("#rentalInfo").append("p").text(" ").classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Price: $ ${element.target.options.icon.options.price}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").html(statement).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Furnished: ${furnished}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Pet Friendly: ${petFriendly}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Rental Type: ${element.target.options.icon.options.rental_type}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").select("p").html(`Source: <a target="_blank" href="${element.target.options.icon.options.url}">${element.target.options.icon.options.source}</a>`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Postal Code: ${element.target.options.icon.options.postal_code}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Publised On: ${element.target.options.icon.options.post_published_date}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(`Description: ${element.target.options.icon.options.description}`).classed('card-text', true);
    d3.selectAll("#rentalInfo").append("p").text(` `).classed('card-text', true);

    //update!!
    displayRecommendation(element, getFilterParm(PriceMin, PriceMax, BedroomsMin, BedroomsMax, FilteredFSA));
}
function displayCommunityListing(element){
    //clear previous
    d3.selectAll("#communityInfo").html("");       
    d3.selectAll("#communityInfo").append("h3").text(element.target.options.agency_name).classed('card-title', true);
    d3.selectAll("#communityInfo").append("p").text(" ").classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Address: $ ${element.target.options.address}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Category: ${element.target.options.category}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Crisis Phone No: ${element.target.options.office_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Office Phone No: ${element.target.options.crisis_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Toll Free Phone No: ${element.target.options.toll_free_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Email: ${element.target.options.e_mail}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Fees: ${element.target.options.fees}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Name: ${element.target.options.service_name}`).classed('card-text', true);
    //create url
    if(element.target.options.website.substring(0,4)!="http"){
        var website= "http://"+element.target.options.website;
    }
    else{
        var website= element.target.options.website;
    }
    d3.selectAll("#communityInfo").select("p").html(`More Information: <a  href=${website} target="_blank">Website</a>`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Hours: ${element.target.options.hours}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Description: ${element.target.options.service_description}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Eligibility: ${element.target.options.eligibility}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(` `).classed('card-text', true);
}


function displayRecommendation(element, filterparams){

    console.log(filterparams)
    //use element id and filterparams to call API and get the 3 recommendations to display

    //testing filterparams and element.id
    console.log("FSA:");
   // console.log(filterparams[2]);
   
   
    id= element.target.options.icon.options.id;
    console.log(id);
//http://127.0.0.1:5000/recommend?id=c_7241928903&price=[0,-1]&bedrooms=[0,-1]&FSA=M6J
    // var filteredUrl;
    if(filterparams[2]==""){
        
        recommendURL= `recommend?id=${id}&price=[${filterparams[0]},${filterparams[1]}]&bedrooms=[${filterparams[3]},${filterparams[4]}]&FSA=${String(element.target.options.icon.options.postal_code).split(" ")[0]}`;
   
    }
    else{
        recommendURL= `recommend?id=${id}&price=[${filterparams[0]},${filterparams[1]}]&bedrooms=[${filterparams[3]},${filterparams[4]}]&FSA=${filterparams[2]}`;
        //filteredURL= `availableRental?price=[${selectedPriceMin},${selectedPriceMax}]&bedrooms=[${selectedBedroomsMin},${selectedBedroomsMax}]&FSA=${selectedFSA}`;
    }
    console.log(recommendURL);
    //get data from constructed url

    d3.json((baseUrl+recommendURL), function(data){
       
        console.log(data[0]);
        console.log(data[1]);
        console.log(data[2]);
        //clear previous Info
        d3.selectAll("#recommendationOneInfo").html("");
        d3.selectAll("#recommendationTwoInfo").html("");
        d3.selectAll("#recommendationThreeInfo").html("");
        // //clear previous Imgs
        // d3.selectAll("#recommendationOneImg").html("");
        // d3.selectAll("#recommendationTwoImg").html("");
        // d3.selectAll("#recommendationThreeImg").html("");

        // //add imgs to One
        // if(element.target.options.icon.options.image != null && ((typeof data[0].image) == "string") && (data[0].image.length > 10)){
        //     d3.select("#recommendationOneImg").attr("src", data[0].image);
        // }else{
        //     d3.select("#recommendationOneImg").attr("src", coming_soon);
        // }

        // //add imgs to Two
        // if(data[1].image != null && ((typeof data[1].image) == "string") && (data[0].image.length > 10)){
        //     d3.select("#recommendationTwoImg").attr("src", data[1].image);
        // }else{
        //     d3.select("#recommendationTwoImg").attr("src", coming_soon);
        // }

        // //add imgs to Three
        // if(data[2].image != null && ((typeof data[2].image) == "string") && (data[2].image.length > 10)){
        //     d3.select("#recommendationThreeImg").attr("src", data[2].image);
        // }else{
        //     d3.select("#recommendationThreeImg").attr("src", coming_soon);
        // }

        //add info to first recommendation
        d3.selectAll("#recommendationOneInfo").append("h3").text(data[0].title).classed('card-title', true);
        d3.selectAll("#recommendationOneInfo").append("p").text(" ").classed('card-text', true);
        d3.selectAll("#recommendationOneInfo").append("p").text(`Price: $ ${data[0].price}`).classed('card-text', true);

        //add info to second recommendation
        d3.selectAll("#recommendationTwoInfo").append("h3").text(data[1].title).classed('card-title', true);
        d3.selectAll("#recommendationTwoInfo").append("p").text(" ").classed('card-text', true);
        d3.selectAll("#recommendationTwoInfo").append("p").text(`Price: $ ${data[1].price}`).classed('card-text', true);

        //add info to Third recommendation
        d3.selectAll("#recommendationThreeInfo").append("h3").text(data[2].title).classed('card-title', true);
        d3.selectAll("#recommendationThreeInfo").append("p").text(" ").classed('card-text', true);
        d3.selectAll("#recommendationThreeInfo").append("p").text(`Price: $ ${data[2].price}`).classed('card-text', true);

    });


    

    

    






}