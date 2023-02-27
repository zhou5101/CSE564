from flask import Flask, render_template, jsonify
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


app = Flask(__name__)

df = pd.read_csv('./data/winequality-red.csv', sep=';', header=0)
std = StandardScaler().fit_transform(df)
pca = PCA().fit(std)
eigen_vals = pd.DataFrame(
    {'FeatureName': df.columns, 'EigenValue': pca.explained_variance_})


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/temp')
def temp():
    return render_template('temp.html')


@app.route('/PCA')
def PCA():
    return eigen_vals.to_json(orient="records")


if __name__ == '__main__':
    app.debug = True
    app.run()
