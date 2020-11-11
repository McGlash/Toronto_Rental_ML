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