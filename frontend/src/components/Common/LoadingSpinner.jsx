import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <Spinner animation="border" variant="primary" className={`spinner-${size}`} />
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;