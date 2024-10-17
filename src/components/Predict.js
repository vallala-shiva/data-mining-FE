import React, { useState } from 'react';
import axios from 'axios';

function Predict() {
  const [formData, setFormData] = useState({
    bedrooms: '',
    bathrooms: '',
    sqft_living: '',
    sqft_lot: '',
    floors: '',
    waterfront: '',
    model: 'ridge'  // Default model choice
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Send POST request to Flask API
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(response.data.predicted_price);  // Store prediction result
    } catch (err) {
      setError('Error predicting price. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Predict House Price</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Bedrooms:</label>
          <input type="number" name="bedrooms" onChange={handleChange} value={formData.bedrooms} style={styles.input} />
        </div>
        
        <div style={styles.formGroup}>
          <label>Bathrooms:</label>
          <input type="number" name="bathrooms" onChange={handleChange} value={formData.bathrooms} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Square Feet (Living):</label>
          <input type="number" name="sqft_living" onChange={handleChange} value={formData.sqft_living} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Square Feet (Lot):</label>
          <input type="number" name="sqft_lot" onChange={handleChange} value={formData.sqft_lot} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Floors:</label>
          <input type="number" name="floors" onChange={handleChange} value={formData.floors} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Waterfront (0 for no, 1 for yes):</label>
          <input type="number" name="waterfront" onChange={handleChange} value={formData.waterfront} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Choose Model:</label>
          <select name="model" onChange={handleChange} value={formData.model} style={styles.input}>
            <option value="ridge">Ridge Regression</option>
            <option value="decision_tree">Decision Tree</option>
            <option value="random_forest">Random Forest</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Predict</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {prediction && <p style={styles.result}>Predicted Price: ${prediction.toFixed(2)}</p>}
    </div>
  );
}

const styles = {
  container: {
    width: '50%',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#343a40',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    marginTop: '20px',
    textAlign: 'center',
  },
  result: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#28a745',
  },
};

export default Predict;
