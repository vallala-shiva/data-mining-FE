import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; 
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line } from 'recharts';

function DataAnalysis() {
  const [edaData, setEdaData] = useState(null);
  const [modelPerformanceData, setModelPerformanceData] = useState(null);
  const [bedroomFilter, setBedroomFilter] = useState(null);
  const [bathroomFilter, setBathroomFilter] = useState(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('scatter');

  useEffect(() => {
    const fetchEdaData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/eda_data');
        console.log('Fetched EDA Data:', response.data);
        setEdaData(response.data);
      } catch (err) {
        setError('Error fetching EDA data');
      }
    };

    const fetchModelPerformance = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/model_performance');
        console.log('Fetched Model Performance Data:', response.data);
        setModelPerformanceData(response.data);
      } catch (err) {
        setError('Error fetching model performance data');
      }
    };

    fetchEdaData();
    fetchModelPerformance();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Filtering logic for bedrooms and bathrooms for EDA (applies only to pie charts)
  const filterEdaData = (data) => {
    if (!data) return [];
    let filteredData = data;

    if (bedroomFilter) {
      filteredData = filteredData.filter(d => Number(d.bedrooms) === bedroomFilter);
    }

    if (bathroomFilter) {
      filteredData = filteredData.filter(d => Number(d.bathrooms) === bathroomFilter);
    }

    console.log("Filtered Data:", filteredData);
    return filteredData;
  };

  const handleBedroomChange = (e) => {
    setBedroomFilter(Number(e.target.value));
  };

  const handleBathroomChange = (e) => {
    setBathroomFilter(Number(e.target.value));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container">
      <h2>Data Analysis</h2>

      <div className="chartTypeSelector">
        <label>Choose Chart Type: </label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="select">
          <option value="scatter">Scatter Plot</option>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      <div className="grid-container">
        {/* Model Performance */}
        {modelPerformanceData && (
          <div className="grid-item wide">
            <h3 className="chart-title">Model Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'scatter' && (
                <ScatterChart data={Object.entries(modelPerformanceData).map(([model, metrics]) => ({
                  model,
                  mse: metrics.mse,
                  r2: metrics.r2,
                }))}>
                  <CartesianGrid />
                  <XAxis dataKey="model" />
                  <YAxis dataKey="mse" />
                  <Tooltip />
                  <Scatter name="MSE" dataKey="mse" fill="#8884d8" />
                </ScatterChart>
              )}
              {chartType === 'line' && (
                <LineChart data={Object.entries(modelPerformanceData).map(([model, metrics]) => ({
                  model,
                  mse: metrics.mse,
                  r2: metrics.r2,
                }))}>
                  <CartesianGrid />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mse" stroke="#8884d8" />
                  <Line type="monotone" dataKey="r2" stroke="#82ca9d" />
                </LineChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={Object.entries(modelPerformanceData).map(([model, metrics]) => ({
                  model,
                  mse: metrics.mse,
                  r2: metrics.r2,
                }))}>
                  <CartesianGrid />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mse" fill="#8884d8" />
                  <Bar dataKey="r2" fill="#82ca9d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Bedroom Distribution */}
        {edaData && (
          <div className="grid-item">
            <h3>Bedroom Distribution</h3>
            <label>Filter by Bedrooms: </label>
            <select onChange={handleBedroomChange} className="select">
              <option value="">All</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={edaData.bedroom_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {edaData.bedroom_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bathroom Distribution */}
        {edaData && (
          <div className="grid-item">
            <h3>Bathroom Distribution</h3>
            <label>Filter by Bathrooms: </label>
            <select onChange={handleBathroomChange} className="select">
              <option value="">All</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="4">4+ Bathrooms</option>
            </select>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={edaData.bathroom_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {edaData.bathroom_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Scatter plot for Square Foot Lot vs Price */}
        {edaData && (
          <div className="grid-item">
            <h3>Square Foot Lot vs Price</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={edaData.scatter_sqft_lot_vs_price}>
                <CartesianGrid />
                <XAxis dataKey="sqft_lot" name="Square Foot Lot" />
                <YAxis dataKey="price" name="Price" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Price vs Square Foot Lot" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Scatter plot for Floors vs Price */}
        {edaData && (
          <div className="grid-item">
            <h3>Floors vs Price</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={edaData.scatter_floors_vs_price}>
                <CartesianGrid />
                <XAxis dataKey="floors" name="Floors" />
                <YAxis dataKey="price" name="Price" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Price vs Floors" fill="#82ca9d" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataAnalysis;
