import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function MapComponent() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch house price data from Flask
    axios.get('http://localhost:5000/house-prices')
      .then(response => {
        
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getColor = (price) => {
    if (price > 900000) return "red"; // High price
    if (price > 500000) return "yellow"; // Medium price
    return "green"; // Low price
  };

  return (
    <div>
      <h1>House Prices on USA Map</h1>
      <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, idx) => (
          <CircleMarker
            key={idx}
            center={[location.latitude, location.longitude]}  // Use latitude and longitude from your dataset
            radius={10}
            fillColor={getColor(location.price)}
            color={getColor(location.price)}
            fillOpacity={0.7}
          >
            <Popup>
              <div>Price: ${location.price}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
