import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Se încarcă...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;