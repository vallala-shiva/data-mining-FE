from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load your dataset (replace 'house_data.csv' with your actual file)
data = pd.read_csv('housing_data.csv')  # Replace this with the path to your dataset

# Filter relevant columns (latitude, longitude, and price)
@app.route('/house-prices', methods=['GET'])
def get_house_prices():
    house_prices = data[['latitude', 'longitude', 'price']].dropna().to_dict(orient='records')
    return jsonify(house_prices)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
