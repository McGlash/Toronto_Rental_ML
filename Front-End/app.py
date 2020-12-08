from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from urls_list import  db_connection_string
import pandas as pd
import re
import numpy as np


#Configure Flask App
app = Flask(__name__)

def createQuery(query, arr, attribute):
    if arr[0] == -1:
        query[attribute] = {"$lte":arr[1]}
    elif arr[1] == -1:
        query[attribute] = {"$gte":arr[0]}
    else:
        query[attribute] = {"$lte":arr[1], "$gte":arr[0]}
    return query
def getAggDataOld(type):
    type_collection = {'availableRental':'CurrentRental', 'rentalTrend':'HistoricRental', 'communityAssets':'CommunityAssets', 'crime':'CrimeAggregate'}
    try:
        collection = type_collection[type]
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find({}, {'_id':0}))
        df = pd.DataFrame(response)
        if type in ['availableRental', 'rentalTrend']:
            df["price"] = df["price"].astype("float")
            #find mean by no. of bedrooms and FSA
            df_aggregate = df.groupby(["FSA", "post_published_date", "bedrooms"])["price"].mean()
            df_updated = df_aggregate.reset_index()
            df_updated.rename(columns={"price" : "average_price"}, inplace=True)
            return df_updated.to_json()
        elif type == 'communityAssets':
            #find mean by no. of bedrooms and FSA
            df_aggregate = df.groupby(["fsa", "category"])["agency_name"].count()
            df_updated = df_aggregate.reset_index()
            df_updated.rename(columns={"agency_name" : "no_assets"}, inplace=True)
            return df_updated.to_json()
        elif type == 'crime':
            return jsonify(response)
        else:
            return jsonify([]),  404
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404

def getAggData(type):
    type_collection = {'rentalPriceAggregate':'rentalPriceAggregate', 'clusterPriceAggregate':'clusterPriceAggregate', 'communityAssets':'CommunityAssets', 'crime':'CrimeAggregate'}
    try:
        collection = type_collection[type]
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find({}, {'_id':0}))
        df = pd.DataFrame(response)
        if type == 'communityAssets':
            #find mean by no. of bedrooms and FSA
            df_aggregate = df.groupby(["fsa", "category"])["agency_name"].count()
            df_updated = df_aggregate.reset_index()
            df_updated.rename(columns={"agency_name" : "no_assets"}, inplace=True)
            return df_updated.to_json()
        elif type in ['rentalPriceAggregate', 'clusterPriceAggregate', 'crime']:
            return jsonify(response)
        else:
            return jsonify([]),  404
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404

def fullData(collection):
    try:
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find({}, {'_id':0}))
        client.close()
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404
    return jsonify(response)

def getCrimeData(collection, attr):
    query = dict()
    if attr in ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']:
        query["MCI"]=attr
    # print(query)
    try:
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find(query, {'_id':0}))
        client.close()
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404
    return jsonify(response)

def getNearestNeighboursData(args):
    
    query = dict()
    try:
        id = args.get("id", None)
        client = MongoClient(db_connection_string)
        enough_info = type(list(client.ETLInsight.CurrentRental.find({'id':id}, {'_id':0,'pred':1}))[0]['pred'])!=str
        if not enough_info:
            return jsonify([]),  404

        price = args.get("price", None)
        bedrooms = args.get("bedrooms", None)
        retrieved_FSA = list(client.ETLInsight.CurrentRental.find({'id':id}, {'_id':0,'FSA':1}))[0]['FSA']
        # FSA = args.get("FSA", None)
        FSA = args.get("FSA", retrieved_FSA)
        #Construct query
        # query['id'] = id
        if price:
            price = [int(val) for val in re.sub('[\[\]]', '', price).split(',')]
            query = createQuery(query, price, "price")
        if bedrooms:
            bedrooms = [int(val) for val in  re.sub('[\[\]]', '', bedrooms).split(',')]
            query = createQuery(query, bedrooms, "bedrooms")
        if FSA:
            query["FSA"] = FSA
        print(query)
        response = list(client.ETLInsight.CurrentRental.find(query, {'_id':0}))
        filtered_postings = list(set(pd.DataFrame(response)['id']).difference({id}))
        retrieved_vectors = pd.DataFrame(list(client.ETLInsight.RecommendCurrent.find({'feasibility': True, 'id': {'$in': filtered_postings}}, {'_id':0})))
        required_columns = retrieved_vectors.columns[2:]
        id_vector = pd.DataFrame(list(client.ETLInsight.RecommendCurrent.find({'id':id}, {'_id':0})))[required_columns].iloc[0].to_list()
        retrieved_vectors['distance_from_the_posting'] = retrieved_vectors.apply(lambda x: np.linalg.norm(x[required_columns]-id_vector), axis=1)
        closest_neighbour_ids = retrieved_vectors[['id', 'distance_from_the_posting']].sort_values(by='distance_from_the_posting')['id'][:3].to_list()
        closest_neighbours = list(client.ETLInsight.CurrentRental.find({'id': {'$in': closest_neighbour_ids}}, {'_id':0}))
        client.close()
        return jsonify(closest_neighbours)        
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404

def RentalData(collection, args):
    query = dict()
    try:
        if args:
            sqft = args.get("sqft", None) #If min or max are null, give -1
            price = args.get("price", None) #If min or max are null, give -1
            FSA = args.get("FSA", None) 
            bedrooms = args.get("bedrooms", None) #If min or max are null, give -1
            bathrooms = args.get("bathrooms", None) #If min or max are null, give -1
            #Construct query
            if(sqft or price or FSA or bedrooms or bathrooms):
                if sqft:
                    sqft =  [int(val) for val in re.sub('[\[\]]', '', sqft).split(',')]
                    query = createQuery(query, sqft, "sqft")
                if price:
                    price = [int(val) for val in re.sub('[\[\]]', '', price).split(',')]
                    query = createQuery(query, price, "price")
                if bedrooms:
                    bedrooms = [int(val) for val in  re.sub('[\[\]]', '', bedrooms).split(',')]
                    query = createQuery(query, bedrooms, "bedrooms")
                if bathrooms:
                    bathrooms = [int(val) for val in re.sub('[\[\]]', '', bathrooms).split(',')]
                    query = createQuery(query, bathrooms, "bathrooms")
                if FSA:
                    query["FSA"] = FSA
            # print(query)
    
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find(query, {'_id':0}))
        client.close()
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404
    return jsonify(response)

def commAssets(collection, args):
    query = dict()
    listcategories = ['Community Services',
            'Education & Employment',
            'Financial Services',
            'Food & Housing',
            'Health Services',
            'Law & Government',
            'Transportation']
    try:
        if args:
            category = args.get("category", None) 
            fsa = args.get("fsa", None)
            #Construct query
            if(category or fsa):
                if category and (category in listcategories):
                    query["category"]=category
                if fsa:
                    query["fsa"]=fsa
            # print(query)
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find(query, {'_id':0}))
        client.close()
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404
    return jsonify(response)

def incomeData(collection, args):
    query = dict()
    try:
        if args:
            FSA = args.get("FSA", None)
            #Construct query
            if FSA:
                query["FSA"]=FSA
            # print(query)
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsight[collection].find(query, {'_id':0}))
        client.close()
    except:
        try:
            client.close()
        except:
            pass
        return jsonify([]),  404
    return jsonify(response)

@app.route('/')
def home_page():
    return render_template('index.html', name='home_page')
@app.route('/availableRental')
def getcurrentRental():
    args = request.args.to_dict()
    # print(args)
    return RentalData("CurrentRental", args) 
    # http://127.0.0.1:5000/availableRental?sqft=[1000,-1]&price=[1500,2500]&bedrooms=[2,-1]&bathrooms=[1,-1]&FSA=M4E  
@app.route('/rentalTrend')
def gethistoricRental():
    args = request.args.to_dict()
    # print(args)
    return RentalData("HistoricRental", args) 
    # http://127.0.0.1:5000/rentalTrend?sqft=[1000,-1]&price=[1500,2500]&bedrooms=[2,-1]&bathrooms=[1,-1]&FSA=M4E 
    # return fullData("HistoricRental")
@app.route('/crimeLastYear')
def getcrimeDynamic():
    attr = request.args.get("MCI")
    return getCrimeData("Crime", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/crimeLastYear?MCI=Break%20and%20Enter
@app.route('/crimeLastSixMonths')
def getcrimeShortSixMonths():
    attr = request.args.get("MCI")
    return getCrimeData("CrimeLastSixMonths", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/crimeLastSixMonths?MCI=Break%20and%20Enter
@app.route('/CrimeLastThreeMonths')
def getcrimeShortThreeMonths():
    attr = request.args.get("MCI")
    return getCrimeData("CrimeLastThreeMonths", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/CrimeLastThreeMonths?MCI=Break%20and%20Enter
@app.route('/CrimeLastMonth')
def getcrimeShortLastMonth():
    attr = request.args.get("MCI")
    return getCrimeData("CrimeLastMonth", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/CrimeLastMonth?MCI=Break%20and%20Enter
@app.route('/communityAssets')
def getcommAssets():
    args = request.args.to_dict()
    # print(args)
    return commAssets("CommunityAssets", args)
    # ['Community Services','Education & Employment','Financial Services','Food & Housing','Health Services','Law & Government','Transportation']
    # http://127.0.0.1:5000/communityAssets?category=Food%20%26%20Housing&fsa=M1P#

@app.route('/fsaIncomeAge')
def getFSAIncomeAge():
    args = request.args.to_dict()
    return incomeData("FSAIncomeAge", args)
    # http://127.0.0.1:5000/fsaIncomeAge?FSA=M4E
        
@app.route('/agg/<type>')
def getAggregate(type):
    return getAggData(type)
    # http://127.0.0.1:5000/agg/rentalPriceAggregate
    # http://127.0.0.1:5000/agg/clusterPriceAggregate
    # http://127.0.0.1:5000/agg/communityAssets
    # http://127.0.0.1:5000/agg/crime    

@app.route('/recommend')
def getNearestNeighbours():
    args = request.args.to_dict()
    return  getNearestNeighboursData(args)
    # http://127.0.0.1:5000/recommend?id=c_7241928903&price=[0,-1]&bedrooms=[0,-1]&FSA=M6J    
    
if __name__ == "__main__":
    app.run(debug=True)