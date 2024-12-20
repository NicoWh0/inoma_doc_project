import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function AdminRoute({ children }) {
    const { user } = useContext(AuthContext);

    if (!user || !user.email_verified || user.type < 1) {
        return (
            <Navigate to="/home" />
        );
    }
    return children;
}
