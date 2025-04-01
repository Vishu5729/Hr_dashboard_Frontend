import React from 'react';

const ErrorPopup = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <div className="error-popup-content">
          <div className="error-popup-header">
            <h3>Error</h3>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="error-popup-body">
            <p>{error}</p>
          </div>
          <div className="error-popup-footer">
            <button className="error-popup-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup; 