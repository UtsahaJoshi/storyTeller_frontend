import React from 'react';
import logo from '../logo.png'; // Ensure the path is correct

function LoadingIndicator() {
  return (
    <div className="loading-container">
      <img src={logo} className="loading-logo" alt="logo" />
      <p className="loading-text">Loading...</p>
    </div>
  );
}

export default LoadingIndicator;
