import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait until authentication state has been checked
    if (loading) return <p>Loading your account...</p>;

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

export default ProtectedRoute;