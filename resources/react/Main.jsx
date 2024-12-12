import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import {
    NotFound,
    Home,
    Login,
    Registration,
    EmailVerification,
    EmailVerificationNotification,
    EmailVerified,
    Profile,
    Enable2FA

} from './pages';
import ScrollToTop from "./components/utils/ScrollToTop";
import ProtectedRoute from "./components/navigation/ProtectedRoute";


export default function Main() {

    const [isHomePage, setIsHomePage] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsHomePage(location.pathname === "/home");
    }, [location]);

    return (
        <div className="app">
            <Header isHomePage={isHomePage} />
            <div className="main-content">
                <ScrollToTop />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/email/verify/notice" element={<EmailVerificationNotification />} />
                    <Route path="/email/verify/:id/:hash" element={<EmailVerification />} />
                    <Route path="/email/verify/success" element={<EmailVerified />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/enable-2fa" element={<Enable2FA />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
