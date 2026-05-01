import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import History from './pages/History';
import './index.css';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="ambient-glow"></div>
        <div className="scan-line"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
