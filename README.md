# Toronto_Rental_ML
## Project Intro/Objective
### Data Sources
* Toronto Rental Data - [Craigslist](https://toronto.craigslist.org/search/hhh), [Kijiji](https://www.kijiji.ca/) - Though Scraping
* Crime Data - [Toronto Police Services Open Data](https://data.torontopolice.on.ca/pages/catalogue) - Through API
* Community Services Data - [Toronto Public Services](https://torontops.maps.arcgis.com/home/item.html?) - Through Scraping
* Income & Age Data - [Canada Revenue Agency](https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/income-statistics-gst-hst-statistics/individual-tax-statistics-fsa/individual-tax-statistics-fsa-2017-edition-2015-tax-year.html#toc9) & [Stats Canada](https://www.statcan.gc.ca/)- Through static files
## Project Architecture
<img src="Design_Documents/Architecture.png" alt="Architecture" width="1000"/>

### Machine Learning 

### FrontEnd

FrontEnd Consists of the `HTML/CSS/Javascript stack`. Javscript retrieves the data from the APIs hosted by Flask based on user's selection 


## Frontend Wireframes 

We created wireframes of the final product we had in mind. The wireframes below show the intial design developed by a our entire team with the user in mind.

<img src="Images/Wireframe_collage.png" alt="Headline" width="1000"/>

### Technologies
* Python
  * Extraction
    * BeautifulSoap
    * Selenium
  * Transformation
    * Pandas
    * Numpy
    * Regex
* MongoDB
  * MongoClient
  * Atlas
* JavaScript
  * D3
  * Leaflet
    * Sidebar
    * Leaflet Panel
    * Heatmap
    * Mapbox
  * Plotly
* Web
  * HTML
  * CSS
  * BootStrap
