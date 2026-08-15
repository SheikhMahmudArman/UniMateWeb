import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
            <h1>Welcome to Dashboard!</h1>
            <p>User: {user.name}</p>
            <p>Role: {user.role}</p>
            <p>This is where we'll build the full dashboard in Issue #3</p>
        </div>
    );
};

export default Dashboard;