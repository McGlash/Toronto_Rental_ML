# Toronto_Rental_ML
## Project Intro/Objective

This project is a continuation of the [Toronto_Rental_Insight project](https://github.com/bnarath/Toronto_Rental_Insight), which involved scrapping Toronto rental posting data on a daily basis and creating an interactive dashboard to make it available to users to explore. 
By building on the Toronto_Rental_Insight project, the current project will achieve the following objectives:
*	Optimize the map function to improve usability.
*	Create a webpage with an interactive dashboard enabling users to benchmark rental costs, crime rates, and community service availability. 
*	Further develop app functionality by incorporating machine learning. 

## Project Architecture

<img src="Images/architecture2.png" alt="Architecture" width="1000"/>

## Approach
### Optimize map function
* The code will be revisited to improve the performance of the map.  Solutions include reducing the number of times each dataset must be read. 
  - After code refactoring, performance is improved significantly.
    - Leaflet extensions are used to store relevant data in markers to use them for various purposes.
    - Single Map is replotted to numerous maps to avoid clutter and to enhance the user experience.
    - New maps are added to produce complete insights for users.
    - **Tools: JavaScript, Python**
### Create dedicate insight webpage
* In the prior iteration of the app, neighbourhood insights were embedded in the map function. In the current iteration, the insights will be located on a dedicated dashboard. 
* The dashboard will include rental cost trends, crime stats and community services information. 
* Users will be able choose which areas they would like to compare.
Tools: JavaScript, Python, d3. 
### Machine learning 

### Problem 1: Predicting fair rental price based on rental features
* Goal: To be able to show users both the actual price of a rental and the fair rental price predicted by our model based on the features of the apartment such as the number of rooms, the crime rate in the neighbourhood etc. 
* Algorithm: Linear Regression 
* Methodology: Train a Linear Regression Model on existing data and get a moderately high accuracy. Apply this model to existing and new incoming rentals.

#### Transformations
- Convert nonstandard nulls (white spaces, None, etc. ) to NaNs to be able to treat them equally
- FSA and rental_type are taken as mandatory entries as the missing value imputation doesn't make much sense (or would mislead) here
- furnished is decoded into 3 categories - 'YES', 'NO', 'NOT_MENTIONED'
- Typecasting (price -> int, post_published_date -> date)
- Derived features
  - 'image' -> Atleast one image is in post or not ? Boolean
  - 'posted_week_of_month' -> Derived from post_published_date
- One hot encoding of all categorical variables


### Problem 2: Clustering rentals to discover interesting patterns 
* Goal: To be able to cluster rentals based on all the features available and analyze the data to discover correlation between different parameters such as weather or not certain types of crime are related to a lack of availabilty of community services. 
* Algorithm: K-means Clustering
* Methodology
### Problem 3 (future scope): Using NLP to recommend rentals based on user's description of their dream living space  
* Goal: To be able to take a natural input description from the user and find a rental with similar features and rental description. 
* Algorithm: Neural Networks
