import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Header from './components/general/Header';
import Footer from './components/general/Footer';
import {
    NotFound,
    Home,
    Login,
    Registration,
    EmailVerification,
    EmailVerificationNotification,
    EmailVerified,
    Profile,
    Enable2FA,
    Disable2FA,
    Page2FA,
    DocManager,
    MyDocs
} from './pages';
import ScrollToTop from "./components/utils/ScrollToTop";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import EmailVerifiedRoute from "./components/navigation/EmailVerifiedRoute";
import AdminRoute from "./components/navigation/AdminRoute";



export default function Main() {

    const [isHomePage, setIsHomePage] = useState(false);
    const [isProfilePage, setIsProfilePage] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsHomePage(location.pathname === "/home");
        setIsProfilePage(location.pathname === "/profile");
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
                    <Route path="/email/verify/notice" element={<ProtectedRoute><EmailVerificationNotification /></ProtectedRoute>} />
                    <Route path="/email/verify/:id/:hash" element={<ProtectedRoute><EmailVerification /></ProtectedRoute>} />
                    <Route path="/email/verify/success" element={<ProtectedRoute><EmailVerified /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/enable-2fa" element={<ProtectedRoute><Enable2FA /></ProtectedRoute>} />
                    <Route path="/disable-2fa" element={<ProtectedRoute><Disable2FA/></ProtectedRoute>} />
                    <Route
                        path="/documentation/management"
                        element={
                            <ProtectedRoute>
                                <EmailVerifiedRoute>
                                    <AdminRoute>
                                        <DocManager/>
                                    </AdminRoute>
                                </EmailVerifiedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/documentation/my-docs"
                        element={
                            <ProtectedRoute>
                                <EmailVerifiedRoute>
                                    <MyDocs/>
                                </EmailVerifiedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/page-2fa" element={<Page2FA />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer isProfilePage={isProfilePage}/>
        </div>
    );
}
