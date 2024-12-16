import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from '../general/Loader';

export default function ProtectedRoute({ children }) {
    const { isEmailVerified, done } = useContext(AuthContext);

    if (!done) {
        return (
            <Loader />
        );
    }
    return isEmailVerified ? children : <Navigate to="/email/verify/notice" />;
}
