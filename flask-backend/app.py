from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS
from sklearn.metrics import mean_squared_error, r2_score

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

housing_data = pd.read_csv('housing_data.csv')

# Load the trained models and scaler
ridge_model = joblib.load('model/ridge_model.pkl')
tree_model = joblib.load('model/decision_tree_model.pkl')
rf_model = joblib.load('model/random_forest_model.pkl')
scaler = joblib.load('model/scaler.pkl')

# Load test data (assuming you saved it as global variables when you trained the model)
# If you haven't saved X_test and y_test, load them from wherever they are stored
X_test = np.load('model/X_test.npy')  # Replace with correct file path if necessary
y_test = np.load('model/y_test.npy')  # Replace with correct file path if necessary

# Dictionary to map model names to the corresponding objects
models = {
    'ridge': ridge_model,
    'decision_tree': tree_model,
    'random_forest': rf_model
}

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Extract the model choice and features from the request
    model_choice = data.get('model')  # Expecting 'ridge', 'decision_tree', or 'random_forest'
    
    # Extract features from the request
    try:
        bedrooms = float(data['bedrooms'])
        bathrooms = float(data['bathrooms'])
        sqft_living = float(data['sqft_living'])
        sqft_lot = float(data['sqft_lot'])
        floors = float(data['floors'])
        waterfront = float(data['waterfront'])
    except (KeyError, ValueError) as e:
        return jsonify({'error': 'Invalid input data'}), 400

    # Prepare the data for prediction
    features = np.array([[bedrooms, bathrooms, sqft_living, sqft_lot, floors, waterfront]])
    
    # Standardize the features (apply the same scaling as during training)
    features_scaled = scaler.transform(features)
    
    # Select the model based on the user's choice
    model = models.get(model_choice)
    
    if model is None:
        return jsonify({'error': 'Invalid model choice. Choose "ridge", "decision_tree", or "random_forest".'}), 400
    
    # Make the prediction
    predicted_price = model.predict(features_scaled)[0]
    
    # Return the prediction as a JSON response
    return jsonify({'predicted_price': predicted_price})

# Model performance endpoint
@app.route('/model_performance', methods=['GET'])
def model_performance():
    # Scale the test data for models that need scaled inputs (like Ridge)
    X_test_scaled = scaler.transform(X_test)
    y_true = y_test  # True house prices from the test set

    # Predictions for each model
    y_pred_ridge = ridge_model.predict(X_test_scaled)
    y_pred_tree = tree_model.predict(X_test)
    y_pred_rf = rf_model.predict(X_test)

    # Calculate MSE and R-squared for each model
    performance = {
        "ridge": {
            "mse": mean_squared_error(y_true, y_pred_ridge),
            "r2": r2_score(y_true, y_pred_ridge)
        },
        "decision_tree": {
            "mse": mean_squared_error(y_true, y_pred_tree),
            "r2": r2_score(y_true, y_pred_tree)
        },
        "random_forest": {
            "mse": mean_squared_error(y_true, y_pred_rf),
            "r2": r2_score(y_true, y_pred_rf)
        }
    }

    return jsonify(performance)

# Function to generate bathroom distribution
def generate_bathroom_distribution(housing_data):
    bathroom_counts = housing_data['bathrooms'].value_counts().reset_index()
    bathroom_counts.columns = ['name', 'value']
    bathroom_counts['name'] = bathroom_counts['name'].apply(lambda x: f"{x} Bathroom" if x < 4 else "4+ Bathrooms")
    return bathroom_counts.to_dict(orient='records')

# Function to generate bedroom distribution
def generate_bedroom_distribution(housing_data):
    bedroom_counts = housing_data['bedrooms'].value_counts().reset_index()
    bedroom_counts.columns = ['name', 'value']
    bedroom_counts['name'] = bedroom_counts['name'].apply(lambda x: f"{x} Bedroom" if x < 4 else "4+ Bedrooms")
    return bedroom_counts.to_dict(orient='records')

# Route to return the EDA data
@app.route('/eda_data', methods=['GET'])
def eda_data():
    # Generate distributions for bathrooms and bedrooms
    bathroom_distribution = generate_bathroom_distribution(housing_data)
    bedroom_distribution = generate_bedroom_distribution(housing_data)

    # Feature comparison data (replace fields if named differently in your dataset)
    scatter_sqft_lot_vs_price = housing_data[['sqft_lot', 'price']].to_dict(orient='records')
    scatter_floors_vs_price = housing_data[['floors', 'price']].to_dict(orient='records')

    # Return the distributions and feature comparison data
    return jsonify({
        'bathroom_distribution': bathroom_distribution,
        'bedroom_distribution': bedroom_distribution,
        'scatter_sqft_lot_vs_price': scatter_sqft_lot_vs_price,
        'scatter_floors_vs_price': scatter_floors_vs_price
    })

# Start the Flask server
if __name__ == '__main__':
    app.run(debug=True)
