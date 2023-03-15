from flask import Flask, render_template, jsonify
import numpy as np
import pandas as pd
# from sklearn.decomposition import PCA
# from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans


app = Flask(__name__)

df = pd.read_csv('./data/winequality-red.csv', sep=';', header=0)
# std = StandardScaler().fit_transform(df.iloc[:, 0:-1])
# pcaModel = PCA()
# pca = pcaModel.fit_transform(std)

# eigen_vals = pd.DataFrame(
#     {'Eigenval': pcaModel.explained_variance_ratio_*100, 'Feature': df.columns.values[:-1]})
# eigen_ratios = pd.DataFrame(
#     {'EigenRatio': np.cumsum(pcaModel.explained_variance_ratio_ * 100), 'Feature': df.columns.values[:-1]})

# pca_wine = pd.DataFrame(
#     data=pca, columns=[f'PC{i}' for i in range(1, len(df.columns))])

# coeff = np.transpose(pcaModel.components_[0:2, :])
# pca2D = pca_wine[['PC1', 'PC2']]
# loadings = pd.DataFrame(data=coeff, columns=['x', 'y'])
# featureName = pd.DataFrame({'feature': df.columns.values[:-1]})

# sov = pd.DataFrame(data=pcaModel.components_, columns=[
#                    f'PC{i}' for i in range(1, len(df.columns))])
# sov['feature'] = df.columns.values[:-1]
# sov = sov.iloc[:, [i for i in range(-1, len(df.columns)-1)]]

data = df.iloc[:, :-1]
kmeanModel1 = KMeans(n_clusters=3)
kmeanModel1.fit(data)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clusterNo')
def clusterNo():
    return jsonify(kmeanModel1.predict(data).tolist())


if __name__ == '__main__':
    app.debug = True
    app.run()
