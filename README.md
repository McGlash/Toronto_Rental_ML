# Toronto_Rental_ML
## Project Intro/Objective
### Data Sources
* Toronto Rental Data - [Craigslist](https://toronto.craigslist.org/search/hhh), [Kijiji](https://www.kijiji.ca/) - Though Scraping
* Crime Data - [Toronto Police Services Open Data](https://data.torontopolice.on.ca/pages/catalogue) - Through API
* Community Services Data - [Toronto Public Services](https://torontops.maps.arcgis.com/home/item.html?) - Through Scraping
* Income & Age Data - [Canada Revenue Agency](https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/income-statistics-gst-hst-statistics/individual-tax-statistics-fsa/individual-tax-statistics-fsa-2017-edition-2015-tax-year.html#toc9) & [Stats Canada](https://www.statcan.gc.ca/)- Through static files
## Project Architecture
<img src="Design_Documents/Architecture.png" alt="Architecture" width="1000"/>

## Machine Learning 

### Problem 1: Predicting fair rental price based on rental features
* Goal: To be able to show users both the actual price of a rental and the fair rental price predicted by our model based on the features of the appartment such as the number of rooms, the crime rate in the neighbourhood etc. 
* Algorithm: Linear Regression 
* Methedology: Train a Linear Regression Model on existing data and get a moderately high accuracy. Apply this model to existing and new incoming rentals.
### Problem 2: Clustering rentals to discover interesting patterns 
* Goal: To be able to cluster rentals based on all the features available and analyze the data to discover correlation between different parameters such as weather or not certain types of crime are related to a lack of availabilty of community services. 
* Algorithm: K-means Clustering
* Methedology
### Problem 3: Using NLP to recomend rentals based on user's description of their dream living space  
* Goal: To be able to take a natural input description from the user and find a rental with similar features and rental description. 
* Algorithm: Nural Networks
### FrontEnd

FrontEnd Consists of the `HTML/CSS/Javascript stack`. Javscript retrieves the data from the APIs hosted by Flask based on user's selection 


## Frontend Wireframes 

We created wireframes of the final product we had in mind. The wireframes below show the intial design developed by a our entire team with the user in mind.

<img src="Images/Wireframe_collage.png" alt="Headline" width="1000"/>

### Technologies
* Machine Learning
  * Scikit-Learn
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
