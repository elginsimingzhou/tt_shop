#!/usr/bin/env python
# coding: utf-8

# In[91]:


import pandas as pd
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

data = pd.read_csv('/Users/yonghui/Desktop/FashionDataset.csv')
data.dropna(how = 'any', inplace = True)
data = data.sample(10000)

#unique id for each product
data["ProductID"] = data.index + 1
data = data.rename(columns = {'ProductID': 'video_id'})
data = data.rename(columns = {'Deatils' : 'Details'})
new_data = data[['video_id','BrandName','Details','Category']]
new_data['product_tags'] = new_data['BrandName'] + " " + new_data['Details'] + " " + new_data['Category']

#generate random users
random_users = []

for i in range(10000):
    length_of_list = random.randint(0, 10)
    random_list = [random.randint(1, 10) for i in range(length_of_list)]
    random_users.append(random_list)
    
new_data['user_id'] = random_users
new_data = new_data[['video_id', 'user_id', 'product_tags']]

def preprocess_data(tiktok_data):
    records = []
    for idx, row in tiktok_data.iterrows():
        for user_id in row['user_id']:
            records.append((row['video_id'], user_id, row['product_tags']))
    return pd.DataFrame(records, columns=['video_id', 'user_id', 'product_tags'])

def extract_product_features(tiktok_data):
    #create a TFIDF vectorizer for the product tags
    vectorizer = TfidfVectorizer()
    product_features = vectorizer.fit_transform(tiktok_data['product_tags'])
    return product_features


def train_recommendation_model(tiktok_data):

    reader = Reader(rating_scale=(0, 1))
    tiktok_data['rating'] = 1
    data = Dataset.load_from_df(tiktok_data[['user_id', 'video_id', 'rating']], reader)
    trainset, testset = train_test_split(data, test_size=0.2)
    algo = SVD()
    algo.fit(trainset)
    
    predictions = algo.test(testset)
    accuracy.rmse(predictions)
    
    return algo


def recommend_products(user_id, model, tiktok_data, product_features):
    user_data = tiktok_data[tiktok_data['user_id'] == user_id]
    liked_product_features = product_features[user_data.index]
    similarity = cosine_similarity(liked_product_features, product_features)
    similarity_scores = similarity.mean(axis=0)
    
    recommended_indices = similarity_scores.argsort()[-5:][::-1]
    
    recommended_products = tiktok_data.iloc[recommended_indices]['product_tags'].values
    return recommended_products

if __name__ == "__main__":
    
    tiktok_data = preprocess_data(new_data)
    product_features = extract_product_features(tiktok_data)
    model = train_recommendation_model(tiktok_data)
    
    user_id = 3
    recommendations = recommend_products(user_id, model, tiktok_data, product_features)
    print("Recommended Products:", recommendations)


