import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
file_path = 'housing_data.csv'  # Update the path accordingly
housing_data = pd.read_csv(file_path)


# Data Preprocessing: Dropping unnecessary columns
housing_data_cleaned = housing_data.drop(columns=['street', 'city', 'statezip', 'country', 'date'])

# Visualizing the distribution of house prices
plt.figure(figsize=(10, 6))
sns.histplot(housing_data_cleaned['price'], bins=50, kde=True)
plt.title('Distribution of House Prices')
plt.xlabel('Price')
plt.ylabel('Frequency')
plt.savefig('public/images/price_distribution.png')  # Save image in React public folder

# Plotting correlation heatmap to understand feature relationships
plt.figure(figsize=(12, 8))
correlation_matrix = housing_data_cleaned.corr()
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", linewidths=0.5)
plt.title("Correlation Heatmap")
plt.savefig('public/images/correlation_heatmap.png')

# Visualizing the relationship between 'sqft_living' and 'price'
plt.figure(figsize=(8, 6))
sns.scatterplot(x='sqft_living', y='price', data=housing_data_cleaned)
plt.title('Relationship between Living Area (sqft) and Price')
plt.xlabel('Living Area (sqft)')
plt.ylabel('Price')
plt.savefig('public/images/sqft_living_vs_price.png')

# Boxplot to compare the number of bedrooms with price
plt.figure(figsize=(8, 6))
sns.boxplot(x='bedrooms', y='price', data=housing_data_cleaned)
plt.title('Boxplot of Bedrooms vs Price')
plt.xlabel('Number of Bedrooms')
plt.ylabel('Price')
plt.savefig('public/images/bedrooms_vs_price.png')

print("All charts have been generated and saved in the 'public/images' folder.")
