import React from 'react';


function DataAnalysis() {
  return (
    <div className="data-analysis-container">
      <h1>Data Analysis</h1>
      
      <div className="analysis-section">
        <h2>Distribution of House Prices</h2>
        <img src="/images/price_distribution.png" alt="Price Distribution" />
      </div>
      
      <div className="analysis-section">
        <h2>Correlation Heatmap</h2>
        <img src="/images/correlation_heatmap.png" alt="Correlation Heatmap" />
      </div>
      
      <div className="analysis-section">
        <h2>Relationship between Living Area and Price</h2>
        <img src="/images/sqft_living_vs_price.png" alt="Living Area vs Price" />
      </div>
      
      <div className="analysis-section">
        <h2>Bedrooms vs Price</h2>
        <img src="/images/bedrooms_vs_price.png" alt="Bedrooms vs Price" />
      </div>
    </div>
  );
}

export default DataAnalysis;

