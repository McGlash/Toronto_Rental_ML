#!/usr/bin/python3
#Dependencies
from craigslist import CraigslistHousing
from pymongo import MongoClient

import requests
from selenium import webdriver
import time
import pandas as pd
import numpy as np
import re
from datetime import datetime, timedelta, timezone
import os
import pickle
# from webdriver_manager.chrome import ChromeDriverManager
import warnings
warnings.filterwarnings("ignore")

from urls_list import * #where all urls and paths are saved
from config import * #keys are saved


#EXTRACT
# Function to scrape craigslist using python package
def craigs_list_api_call():
# This function returns the result of the listings based on site and category
# The search URL is as below
# https://toronto.craigslist.org/search/tor/apa?
    cl_tor_housing = CraigslistHousing(site='toronto',
                                       area='tor',
                                       category='apa',
                             filters={'bundle_duplicates': 1})

    #If geotagged=True, the results will include the (lat, lng) in the 'geotag' attrib (this will make the process a little bit longer).
    craiglist_housing = []

    for result in cl_tor_housing.get_results(sort_by='newest', geotagged=True):
        craiglist_housing.append(result)
    print("Finished craigs_list_api_call")
    return craiglist_housing

def differencer(DF):
    #Finds out the data to be scraped after comparing with the 
    #already existing data in the data base
    # Input - DF
    # Output - To be scraped IDs
    # Also clears the CurrentRental collection and updates it with the current rental
    all_postings_ids = DF['id'].map(lambda x: 'c_'+str(x))
    client = MongoClient(db_connection_string)
    db = client.ETLInsights #DB
    retrieved_postings = list(db.HistoricRental.find({'id': {'$in': list(all_postings_ids)}}))
    to_be_scraped_ids = set(all_postings_ids).difference(map(lambda x: x['id'], retrieved_postings))
    #Truncate and update the CurrentRental collection
    db.CurrentRental.delete_many({})
    db.CurrentRental.insert_many(retrieved_postings)
    client.close()
    print("Finished differencer")
    return list(map(lambda x: x[2:], to_be_scraped_ids))

def instatiate_driver():
    #########################################################################################
    #Instatiate Selenium driver
    #Returns the handle object
    #########################################################################################
    # executable_path = os.environ.get('CHROMEDRIVER_PATH', '/usr/local/bin/chromedriver')#
    # driver = webdriver.Chrome(ChromeDriverManager().install())
    executable_path = os.environ.get('CHROMEDRIVER_PATH', '/Users/bincynarath/.wdm/drivers/chromedriver/mac64/86.0.4240.22/chromedriver')
    chrome_bin = os.environ.get('GOOGLE_CHROME_BIN', '/Users/bincynarath/.wdm/drivers/chromedriver/mac64/86.0.4240.22/chromedriver')#
    options = webdriver.ChromeOptions()#
    #options.binary_location = chrome_bin#
    options.add_argument("--no-sandbox") 
    options.add_argument("--disable-gpu") 
    options.add_argument("--headless") 
    driver = webdriver.Chrome(executable_path=executable_path, options=options)#
    #driver = webdriver.Chrome(executable_path=executable_path)#
    print("Finished instatiate_driver")
    return driver

def craigs_list_scrape(craigs_list_post_docs):
    # Scraping the craigslist posting data using the urls obtained 
    # through craigslist Python Module call

    #Instatiate the selenium driver
    driver = instatiate_driver()
    error_list = []
    

    craigs_list_post_docs_cp = craigs_list_post_docs.copy()
    for post in craigs_list_post_docs_cp:

        #Visit the url
        driver.get(post['url'])

        #Separate Try Except to handle each cases separately
        #Apartment feature(Some extra feature beside the title)
        try:
            apartment_feature = driver.find_element_by_css_selector('span[class="postingtitletext"] span[class="housing"]').text
        except:
            #print(post['id'])
            error_list.append({post['id']:'apartment_feature'})
            apartment_feature = None
        finally:
            post['apartment_feature'] = apartment_feature

        #First image if present   
        try:
            image = None
            if post['has_image']:
                image = driver.find_element_by_css_selector('div[class="gallery"]').find_element_by_css_selector('img').get_attribute('src')
        except:
            print(post['id'])
            error_list.append({post['id']:'image'})
        finally:
            post['has_image'] = image

        #Body of the post  
        try:
            posting = driver.find_element_by_id("postingbody").text
        except:
            print(post['id'])
            error_list.append({post['id']:'postingbody'})
            posting = None
        finally:
            post['posting'] = posting

        #Attributes      
        try:
            attributes = [elem.text for elem in driver.find_elements_by_css_selector('p[class="attrgroup"]  span')]
        except:
            print(post['id'])
            error_list.append({post['id']:'attributes'})
            attributes = []
        finally:
            post['attributes'] = attributes
            
        time.sleep(1)
            
    driver.quit()    
    print("Finished craigs_list_scrape")   
    return craigs_list_post_docs_cp

# TRANSFORM
def clean_craigslist(DF):
    ### Remove Duplicates and unreliable data
    # - All duplicated data are removed
    # - Dont consider empty postings
    # - Drop all those rows which don't have both 'geotag' and 'where'
    # Convert attributes list to string
    # Convert the apartment feature none to ''(string)

    #Duplicates cannot hash list
    DF.drop_duplicates(subset=DF.columns[:-1], keep="first", inplace=True)
    #Dont consider empty postings
    DF.dropna(subset=['posting'], inplace=True)
    #Location:- Coming to whereabouts, in most of the cases, we have geotag. Some of the cases which doesn't have geotag,
    #we have "where". Check below.We need to drop all those rows which don't have both
    DF.dropna(subset=['where', 'geotag'], how='all', inplace=True)
    #Convert attributes list to string
    DF['attributes'] = DF['attributes'].map(lambda x: ' '.join(x))
    #Convert the apartment feature none to ''(string)
    DF['apartment_feature'].fillna(value=' ', inplace=True)#A string val
    #Combine the "attributes", "apartment_feature", "posting" together as "text" column
    DF["text"] = DF.apply(lambda x: (x["attributes"] if x["attributes"] else "")+ (x["apartment_feature"] if x["apartment_feature"] else "")+(x["posting"] if x["posting"] else ""), axis=1)
    #Use DF["text"] for all further extractions 
    print("Finished clean_craigslist")   
    return DF



def extract(s):
    # Combine the "attributes", "apartment_feature", "posting" together as "text" column for string search using regex to derive new features
    # New features derived are
    # sf - Square Feet : (int or None) Based on ft2|SqFt in the text data
    # br - Bed Room: (float or None) Number of bedrooms, based on what is preceding BR 
    # ba - Bath: (float or None) Number of bath, based on what is preceding Ba
    # cats_allowed - True or False, based on the presence of 'cats are OK - purrr'
    # dogs are OK - wooof - True or False, based on the presence of 'dogs are OK - wooof'
    # Type - Type of the housing 1 out of ``['condo', 'house', 'apartment', 'suite', 'townhouse', 'loft', 'duplex',
    #     'flat', 'cottage', 'land']`` or ``None``
    # furnished - True/Flase/None - based on the presense of (un|non)(-) furnished strings or nothing
    
    #DF['Text'] comes here as the input

    #Square Feet
    sf_found = re.findall(r'(\d+) *(ft2|SqFt)', s)
    sf =  (None if not sf_found else int(sf_found[0][0]))

    #Bed Room
    br_found = re.findall(r'(\d){0,1}(.5){0,1} *BR', s)
    br = float(''.join(br_found[0])) if  br_found and ''.join(br_found[0]) else None #To handle ('','','') situation
            
    
    #Bath
    ba_found = re.findall(r'(\d){0,1}(.5){0,1}(\+){0,1} *B[aA]',s)
    ba = float(re.sub(r'[^\d]', '', ''.join(ba_found[0]))) if  ba_found and re.sub(r'[^\d]', '', ''.join(ba_found[0])) else None
    
    
    #'cats are OK - purrr'
    cats_allowed = (True if re.findall('cats are OK - purrr', s) else False)
    
    #'dogs are OK - wooof'
    dogs_allowed = (True if re.findall('dogs are OK - wooof', s) else False)
    
    #Check the type of the commodity
    re.sub(r'[\n\.,!/?()]', ' ', s) #Remove unnecessary chars. We need to capture apartment\ also as word apartment
    cleaned_s = re.sub(r'[\n\\.,!\/?]', ' ', s)
    found_type = re.findall(r"\b(townhouse|loft|land|house|flat|duplex|condo|cottage|suite)\b", cleaned_s, flags=re.IGNORECASE) 
    Type = (None if not found_type else found_type[0].lower())
    #Though apartment is a generic term, some people mention the type as apartment, we are going to take that as the last priority
    #if nothing else is mentioned
    if not Type:
        found_type = re.findall(r"\bapartment\b", cleaned_s, flags=re.IGNORECASE)
        Type = (None if not found_type else found_type[0].lower())
        
    #Furnished or Unfurnished checks
    found_un = re.findall('(non|un)-*(?=furnished)', s , flags=re.IGNORECASE)
    furnished = False
    if not found_un:
        #furnished = None #Nothing found
        found_furnished = re.findall('furnished', s , flags=re.IGNORECASE)
        furnished = (None if not found_furnished else True)
    
    # print("Finished extract")
    return [sf,br,ba, cats_allowed, dogs_allowed, Type, furnished]



def geocode(addresses):
    ### Geocode(MapQuest) the address to lat long
    #Input: a dictionary with key as index and value as address
    #Output: a dictionary with key as index and value as (lat, long) tuple
    lat_long = {}
    for index in addresses:
        try:
            #Small tweek for 'queens quay'
            location = (addresses[index]+' ,Toronto' if addresses[index].lower()=='queens quay' else addresses[index])
            url = geocode_mq_base+f'key={mq_key}&location={location}'
            url = re.sub(' +', '%20', url)
            response = requests.get(url)
            if response.ok:
                content = response.json()
                lat_long[index]=tuple(content['results'][0]['locations'][0]['latLng'].values())
            else:
                lat_long[index]=None
        except Exception as e:
            print(e)
            lat_long[index]=None
    # print("Finished geocode")
    return lat_long

def reverse_geocode(loc):
    #(MapQuest)
    #Input: tuple - (lat, long)
    #Output: string - Postal Code
    lat, long = loc
    postal_code = None
    try:
        url = reverse_geocode_mq_base.format(mq_key, lat, long)
        url = re.sub(' +', '%20', url)
        #print(url)
        response = requests.get(url)
        if response.ok:
            content = response.json()
            postal_code = content['results'][0]["locations"][0]['postalCode'] if 'postalCode'\
            in content['results'][0]["locations"][0] else None
    except Exception as e:
        print(e)
    # print("Finished reverse_geocode")
    return postal_code 


def fill_Lat_Long(DF):
    # Lat Long from address
    # Postal Code (Reverse Geocode) from Lat Long
    addresses = DF[DF['geotag'].isnull()]['where'].to_dict()
    lat_long = geocode(addresses)
    ## Replace the Null geocodes with the geocodes retrieved from the address
    DF.loc[lat_long.keys(), 'geotag'] = DF.loc[lat_long.keys()].index.map(lat_long)
    DF['postal_code'] = DF['geotag'].map(lambda x: reverse_geocode(x))
    # Discarding  items which doesn't have postal code
    DF.drop(index=DF[DF['postal_code'].isnull()].index, inplace=True)
    # Some are Florida postal codes
    Florida_Zipcodes = DF['postal_code'][DF['postal_code'].map(lambda x : re.findall(r'^[\d].*', x)[0] if re.findall(r'^[\d].*', x) else None).notnull()].index    
    DF.drop(index=Florida_Zipcodes, inplace=True)
    print("Finished fill_Lat_Long")
    return DF



def clean_rental_for_merge(df):
    # We need to concatenate craigslist table with kijiji table
    # All the column names have to be unique

    DF= df.copy()
    #To rename
    DF.rename(columns={"has_image":"image", "name":"title", "datetime":"post_published_date", "where":"address", "Type":"rental_type", "BR":"bedrooms", "Ba":"bathrooms", "sf":"sqft", "text":"description"}, inplace=True)              
    #To extract
    DF['pet_friendly'] = DF.apply(lambda x: x['cats_allowed'] | x['dogs_allowed'], axis=1)
    DF['lat'] = DF.geotag.map(lambda x: float(x[0]))
    DF['long'] = DF.geotag.map(lambda x: float(x[1]))
    #To clean
    DF['price'] = DF['price'].map(lambda x: int(re.sub(r'[^\d]', '',x)) if re.sub(r'[^\d]', '',x) else re.sub(r'[^\d]', '',x))
    #To drop
    DF.drop(["repost_of", "deleted", "apartment_feature", "cats_allowed", "dogs_allowed", "geotag", "posting", "attributes", "last_updated"], axis=1, inplace=True)
    #Add one source column
    DF['source'] = 'craigslist'
    #FSA
    DF['FSA']=DF['postal_code'].map(lambda x:x.split(' ')[0])
    #Reorder
    DF = DF[['id', 'title', 'price', 'sqft','image','url','post_published_date', 'lat', 'long', 'postal_code', 'FSA', 'rental_type','bedrooms', 'bathrooms', 'furnished', 'pet_friendly', 'description', 'source']]
    #Append c_ to the index
    DF['id'] = DF['id'].map(lambda x: 'c_'+str(x))
    #Change date
    DF.post_published_date = DF.post_published_date.map(lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d"))
    #Fix num of bathrooms
    DF['bathrooms'] = DF['bathrooms'].map(lambda x: (x/10 if x>10 else x))
    DF.fillna("", inplace=True)
    print("Finished clean_rental_for_merg")  
    return DF

def feasibilityCheck(row):
    #Check if prediction is feasible or not
    if (not row["FSA"]) or (not row["rental_type"]) or (not re.search('^M', row["FSA"])):
        return False
    if row["sqft"]:
        if (row["sqft"]>3000) or (row["sqft"]<200):
            return False
    return True

def preprocess(DF):
    #preprocess for the prediction
    feasibility = DF.apply(lambda x: feasibilityCheck(x), axis=1)
    DF = DF[feasibility]
    #Replace all white spaces or nothing at all to NaN
    DF.replace(r'^\s*$', np.nan, regex=True, inplace=True)
    #Replace None with NaN
    DF = DF.fillna(value=np.nan)
    #Typecast
    DF['price'] = DF['price'].astype('int') #Not required
    #Missing value handling
    DF['furnished'] = DF['furnished'].fillna(value="NOT_MENTIONED")
    DF['furnished'] = DF['furnished'].replace(to_replace=True, value='YES')
    DF['furnished'] = DF['furnished'].replace(to_replace=False, value='NO')
    #New features 
    DF['post_published_date'] = DF['post_published_date'].map(lambda x: datetime.strptime(x, '%Y-%m-%d'))
    DF['posted_week_of_month'] = DF['post_published_date'].map(lambda x: x.day//7 +1)
    ##Convert image url to image or not? (New feature)
    DF['image'] = DF['image'].notna()
    #Basic transformation
    DF.reset_index(drop=True, inplace=True)
    #OHE
    num_columns = ['sqft', 'bedrooms', 'bathrooms', 'posted_week_of_month']
    cat_columns = ['image', 'FSA', 'rental_type', 'furnished', 'pet_friendly']
    try:
        enc = pickle.load(open('OHE.pickle', 'rb'))
    except:
        enc = pickle.load(open('Code/OHE.pickle', 'rb'))
    ##OHE Transform
    ohe_output = enc.transform(DF[cat_columns]).toarray()
    ohe_dict = {f'x{index}':col for index,col in enumerate(cat_columns)}
    ohe_labels = [ohe_dict[feature.split('_')[0]]+'_'+feature.split('_')[1] for feature in enc.get_feature_names()]
    DF = pd.concat([DF, pd.DataFrame(ohe_output, columns=ohe_labels)], axis=1)
    DF.drop(cat_columns, axis=1, inplace=True)
    selected_columns = ['sqft', 'bedrooms', 'bathrooms', 'image_False', 'FSA_M1B', 'FSA_M1M',
       'FSA_M1P', 'FSA_M1V', 'FSA_M1W', 'FSA_M2M', 'FSA_M3C', 'FSA_M3K',
       'FSA_M4E', 'FSA_M4V', 'FSA_M4W', 'FSA_M5G', 'FSA_M5J', 'FSA_M5R',
       'FSA_M5S', 'FSA_M5V', 'FSA_M6B', 'FSA_M6E', 'FSA_M6G', 'FSA_M6J',
       'FSA_M6K', 'FSA_M6M', 'FSA_M6P', 'rental_type_apartment',
       'rental_type_condo', 'rental_type_house', 'rental_type_loft',
       'rental_type_townhouse', 'furnished_NOT', 'furnished_YES',
       'pet_friendly_False']
    DF = DF[['id']+selected_columns]
    return DF, selected_columns

def predict(DF, selected_columns):
    #Prediction: Returns ID vs predicted price
    try:
        xgb_model = pickle.load(open('xgb_model.pickle', 'rb'))
    except:
        xgb_model = pickle.load(open('Code/xgb_model.pickle', 'rb'))
    y_pred = xgb_model.predict(DF[selected_columns])
    DF['pred'] = y_pred
    prediction_mapping = DF[['id', 'pred']].set_index('id').T.to_dict()
    return prediction_mapping

def predictPrice(DF):
    #Appends the predicted price at the end of the dataframe
    New_DF, selected_columns = preprocess(DF)
    prediction_mapping = predict(New_DF,selected_columns)
    DF['pred'] = DF['id'].map(lambda x: prediction_mapping[x]['pred'] if x in prediction_mapping else 'Not Feasible to predict')
    return DF

def updateDB():
    # This is the main function scheduler calls to undate the database

    #CRAIGSLIST EXTRACT STEPS
    # Step1: Craigslist limited scraping using Python Module
    craiglist_housing = craigs_list_api_call()
    # Step2: Call differencer to update the CurrentRental with what is already present in HistoricRental; Then finds out which posts need scraping
    to_be_scraped_ids = differencer(pd.DataFrame(craiglist_housing))
    # Step3: Filter out the to be scraped listings and scrape further
    TBS = list(filter(lambda x: x['id'] in to_be_scraped_ids, craiglist_housing))
    craiglist_housing_enriched = craigs_list_scrape(TBS)

    #CRAIGSLIST TRANSFORM STEPS
    # Step1: Cleanup
    DF = clean_craigslist(pd.DataFrame(craiglist_housing_enriched))
    # Step2: Derive additional features from the text
    DF[['sf', 'BR', 'Ba','cats_allowed', 'dogs_allowed', 'Type', 'furnished']] = pd.DataFrame(DF['text'].map(lambda x : extract(x)).to_list(), index=DF.index)
    # Step3: Filllatlong
    DF = fill_Lat_Long(DF)
    
    
    if not DF.empty:
        # Step4: Transformation required to be merged with Kijiji
        DF = clean_rental_for_merge(DF)
        # Step5: Incorporate the prediction part
        DF = predictPrice(DF)
        
        #Load the increment
        client = MongoClient(db_connection_string)
        client.ETLInsights.HistoricRental.insert_many(DF.T.to_dict().values())
        client.ETLInsights.CurrentRental.insert_many(DF.T.to_dict().values())
        client.close()
        print("Finished updateDB")

##Checking update
if __name__ == "__main__":
    updateDB()
