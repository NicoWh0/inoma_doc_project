import React from "react";
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

export default function Main() {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
