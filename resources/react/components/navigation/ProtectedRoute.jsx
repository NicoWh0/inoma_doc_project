import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from '../general/Loader';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, done } = useContext(AuthContext);

    if (!done) {
        return (
            <Loader />
        );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
}
