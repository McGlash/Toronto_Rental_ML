import requests
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.impute import KNNImputer
from datetime import datetime
from sklearn.preprocessing import OneHotEncoder
import io
url_rentalTrend = "http://127.0.0.1:5000/rentalTrend"
url_communityAssets = "http://127.0.0.1:5000/communityAssets"
url_fsaIncome = "http://127.0.0.1:5000/fsaIncomeAge"
url_crimeCSV = "https://raw.githubusercontent.com/SograMemon/Toronto_Rental_ML/Megan/Data/Crime_Data/Master_Toronto_Crime_2017to2019_Aggregate.csv"

def transform():
    #load data from all four data sources
    response = requests.get(url_rentalTrend) #rental trends
    df_rental = pd.read_json(response.text, orient='records')

    response = requests.get(url_communityAssets) #community assets
    df_community = pd.read_json(response.text, orient='records')

    response = requests.get(url_fsaIncome) #FSA Income
    df_income = pd.read_json(response.text, orient='records')

    download = requests.get(url_crimeCSV).content #Crime data from a csv file on github
    df_crime = pd.read_csv(io.StringIO(download.decode('utf-8')))

    #Data Cleaning and Transformation

    #Rental Data
    df_rental.drop(["price"], axis=1, inplace=True) #remove unwanted columns

    #Replace all white spaces or nothing at all to NaN
    df_rental.replace(r'^\s*$', np.nan, regex=True, inplace=True)
    #Replace None with NaN
    df_rental = df_rental.fillna(value=np.nan)
    df_rental['furnished'] = df_rental['furnished'].fillna(value="NOT_MENTIONED")
    df_rental['furnished'] = df_rental['furnished'].replace(to_replace=True, value='YES')
    df_rental['furnished'] = df_rental['furnished'].replace(to_replace=False, value='NO')
    #Convert image url to image or not?
    df_rental['image'] = df_rental['image'].notna()
    #replace image url with one and nan with 0
    df_rental["image"]= df_rental["image"].apply(lambda x: 0 if (pd.isna(x)) else 1)
    #Replace nan in rental_type with apartment
    df_rental["rental_type"]= df_rental["rental_type"].apply(lambda x: "apartment" if (pd.isna(x)) else x)

    #Community Data

    #Replace all white spaces or nothing at all to NaN
    df_community.replace(r'^\s*$', np.nan, regex=True, inplace=True)
    #Replace None with NaN
    df_community = df_community.fillna(value=np.nan)
    df_community= df_community[["fsa","category"]]

    #Transform community assets df to show number of assets in each category in each FSA
    df_group=df_community.groupby(['fsa', 'category'])["category"].size() #group by fsa and category
    FSA= df_community["fsa"].unique().tolist() #get unique FSA list
    service_catagory= df_community["category"].unique().tolist() #get unique community services category list

    #for loop to make a matrix with unique FSA in each row and unique community service asset category in each column
    rows = []
    col=[]
    for fsa in FSA:
        col.append(fsa)
        df_community_FSA=df_community[df_community["fsa"]==fsa]
        for service in service_catagory:
            try:
                sum=len(df_community_FSA[df_community_FSA["category"]==service]["category"])
            except ValueError:
                sum=0
            col.append(sum)
        rows.append(col)
        col=[]
    df_community_clean = pd.DataFrame(rows, columns=['fsa', 'Community Services',
 'Health Services','Financial Services','nan','Law & Government','Transportation','Food & Housing','Education & Employment'] ) #check
    df_community_clean.drop(["nan"], axis=1, inplace=True)

    #Crime Data

    #Replace all white spaces or nothing at all to NaN
    df_crime.replace(r'^\s*$', np.nan, regex=True, inplace=True)
    #Replace None with NaN
    df_crime = df_crime.fillna(value=np.nan)

    #select columns needed
    df_crime= df_crime[["FSA", "MCI", "Count of MCI"]]

    MCI= df_crime["MCI"].unique().tolist() #get unique list of crime type
    FSA= df_crime["FSA"].unique().tolist() #get unique FSA list in crime CSV

    #For loop to generate a matrix with unique FSA as each row and unique crime type as each column
    rows = []
    col=[]
    for fsa in FSA:
        col.append(fsa)
        MCI_FSA=df_crime[df_crime["FSA"]==fsa]["MCI"].tolist()
        df_MCI_FSA=df_crime[df_crime["FSA"]==fsa]
        for mci in MCI:
            try:
                sum=df_MCI_FSA[df_MCI_FSA["MCI"]==mci]["Count of MCI"].sum()
            except ValueError:
                sum=0
            col.append(sum)
        rows.append(col)
        col=[]
    df_crime_clean = pd.DataFrame(rows, columns=['fsa', 'Assault', 'Auto Theft', 'Break and Enter', 'Robbery', 'Theft Over']) #check

    #Combine data frames
    df_income.rename(columns={"FSA": "fsa"}, inplace="True") #rename column to make it same as other dfs

    df_combined=df_income.join(df_crime_clean.set_index("fsa"), on='fsa', how="inner")

    df_combined= df_community_clean.join(df_combined.set_index('fsa'), on='fsa', how="inner")

    df_rental.rename(columns={"FSA": "fsa"}, inplace="True")
    df_combined= df_rental.join(df_combined.set_index('fsa'), on='fsa', how="inner")
    df_combined.dropna(subset=['fsa', 'Community Services'], inplace=True)

    #Type casting
    df_combined['Community Services'] = df_combined['Community Services'].astype('int')
    df_combined['Health Services'] = df_combined['Health Services'].astype('int')
    df_combined['Law & Government'] = df_combined['Law & Government'].astype('int')
    df_combined['Transportation'] = df_combined['Transportation'].astype('int')
    df_combined['Food & Housing'] = df_combined['Food & Housing'].astype('int')
    df_combined['Education & Employment'] = df_combined['Education & Employment'].astype('int')
    df_combined['Assault'] = df_combined['Assault'].astype('int')
    df_combined['Auto Theft'] = df_combined['Auto Theft'].astype('int')
    df_combined['Break and Enter'] = df_combined['Break and Enter'].astype('int')
    df_combined['Robbery'] = df_combined['Robbery'].astype('int')
    df_combined['Theft Over'] = df_combined['Theft Over'].astype('int')



    #Convert post_published_date to week of the month
    df_combined['post_published_date'] = df_combined['post_published_date'].map(lambda x: datetime.strptime(x, '%Y-%m-%d'))

    #New features
    df_combined['posted_week_of_month'] = df_combined['post_published_date'].map(lambda x: x.day//7 +1)

    #Remove Outliers
    num_columns = ['sqft', 'bedrooms', 'bathrooms', 'Community Services','Health Services',
              'Law & Government', 'Transportation', 'Food & Housing', 'Education & Employment', 'Assault', 'Auto Theft',
              'Break and Enter','Robbery', 'Theft Over', 'Avg_Age', 'avg_income']
    cat_columns = ['image', 'fsa', 'rental_type', 'furnished', 'pet_friendly']
    nlp_scope_columns = ['title', 'description']
    df_combined.reset_index(drop=True, inplace=True)

    #Remove sqft > 3000 and less than 200
    

    
    df_combined.drop(df_combined[(df_combined['sqft']<200) | (df_combined['sqft']>3000)].index, axis=0, inplace=True)

    

    X= df_combined[num_columns + cat_columns]
    ##OHE
    enc = OneHotEncoder()
    ##OHE Fit
    enc.fit(X[cat_columns])
    ##OHE Transform
    ohe_output = enc.transform(X[cat_columns]).toarray()
    ##Retrieve OHE labels
    ohe_dict = {f'x{index}':col for index,col in enumerate(cat_columns)}
    ohe_labels = [ohe_dict[feature.split('_')[0]]+'_'+feature.split('_')[1] for feature in enc.get_feature_names()]
    X.reset_index(drop=True, inplace=True)
    X = pd.concat([X, pd.DataFrame(ohe_output, columns=ohe_labels)], axis=1)
    X.drop(cat_columns, axis=1, inplace=True)

    pd.DataFrame(ohe_output, columns=ohe_labels)

    #Imputation
    scaler = MinMaxScaler()
    scaler.fit(X)
    columns = X.columns
    X = pd.DataFrame(scaler.transform(X), columns=columns)

    imputer = KNNImputer(n_neighbors=3)
    imputer.fit(X[['sqft', 'bedrooms','bathrooms']])
    X.loc[:,['sqft', 'bedrooms','bathrooms']] = imputer.transform(X[['sqft', 'bedrooms','bathrooms']])
    X.to_csv('out2.csv', index=False)
transform()







    


    
