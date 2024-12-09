import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Registration';
import EmailVerification from './pages/EmailVerification';
import EmailVerificationNotification from "./pages/EmailVerificationNotification";

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
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/email/verify" element={<EmailVerificationNotification />} />
                    <Route path="/email/verify/:id/:hash" element={<EmailVerification />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
