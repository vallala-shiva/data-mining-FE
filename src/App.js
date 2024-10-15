import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import DataAnalysis from './components/DataAnalysis';
import Predict from './components/Predict';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul className="navbar">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/data-analysis">Data Analysis</Link></li>
              <li><Link to="/predict">Predict</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
