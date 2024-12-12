import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, done } = useContext(AuthContext);

    if (!done) {
        return (
            <div className="loading">
                <ClipLoader color="#FF0000" loading={true} size={150} />
            </div>
        );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
}
