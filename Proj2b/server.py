from flask import Flask, render_template, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.manifold import MDS
from matplotlib import pyplot as plt

app = Flask(__name__)

df = pd.read_csv('./data/winequality-red.csv', sep=';', header=0)
data = df.iloc[:, :-1]
data = data.sample(frac=.5)
std = StandardScaler().fit_transform(data)
kmeanModel1 = KMeans(n_clusters=3)
kmeanModel1.fit(data)
clusterID = kmeanModel1.predict(data)

embeddings = MDS(n_components=2, random_state=0)
data_transform = embeddings.fit_transform(std)
print("MDS complete")

corre_matrix = 1-data.corr().abs()
MDS_corr = MDS(n_components=2, dissimilarity='precomputed', random_state=0)
corr_transform = MDS_corr.fit_transform(corre_matrix)


@app.route('/')
def index():
    return render_template('index.html')


corre_matrix = 1-data.corr().abs()
MDS_corr = MDS(n_components=2, dissimilarity='precomputed', random_state=0)
corr_transform = MDS_corr.fit_transform(corre_matrix)


@app.route('/clusterNo')
def clusterNo():
    return jsonify(clusterID.tolist())


@app.route('/data')
def wine_data():
    return data.to_json(orient='records')


@app.route('/feature_list')
def features():
    return jsonify(data.columns.values.tolist())


@app.route('/mds')
def mds():
    return jsonify(data_transform.tolist())


@app.route('/mds_corr')
def mds_corr():
    return jsonify(corr_transform.tolist())


if __name__ == '__main__':
    app.debug = True
    app.run()
