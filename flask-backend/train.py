import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# 1. Load the dataset
dataset_path = 'housing_data.csv'  # Ensure the path is correct
housing_data = pd.read_csv(dataset_path)

# 2. Data Preprocessing: Drop unnecessary columns
housing_data_cleaned = housing_data.drop(columns=['street', 'city', 'statezip', 'country', 'date'])

# 3. Handle missing values (if necessary)
# For simplicity, we will assume no missing values based on your notebook's earlier inspection
missing_values = housing_data_cleaned.isnull().sum()
print("Missing values per column:\n", missing_values)

# 4. Prepare features (X) and target (y)
X = housing_data_cleaned[['bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot', 'floors', 'waterfront']]
y = housing_data_cleaned['price']

# 5. Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

import numpy as np

# Save the test data for future evaluation
np.save('model/X_test.npy', X_test)
np.save('model/y_test.npy', y_test)


# 6. Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 7. Train Ridge Regression
ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train_scaled, y_train)

# 8. Train Decision Tree Regressor
tree_model = DecisionTreeRegressor(max_depth=5, random_state=42)
tree_model.fit(X_train, y_train)

# 9. Train Random Forest Regressor
rf_model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
rf_model.fit(X_train, y_train)

# 10. Save the trained models
model_dir = 'model'
os.makedirs(model_dir, exist_ok=True)

# Save Ridge, Decision Tree, and Random Forest models
joblib.dump(ridge_model, os.path.join(model_dir, 'ridge_model.pkl'))
joblib.dump(tree_model, os.path.join(model_dir, 'decision_tree_model.pkl'))
joblib.dump(rf_model, os.path.join(model_dir, 'random_forest_model.pkl'))

# Save the scaler for future use
joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))

print("Models and scaler saved in 'model/' directory.")
