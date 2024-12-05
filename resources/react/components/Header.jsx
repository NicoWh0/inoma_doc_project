import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    const [isAtTop, setIsAtTop] = React.useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY <= 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    })
    return (
        <header id="header">
            <nav className={`navbar ${isAtTop ? "transparent":"opaque"}`}>
                <Link to="/home" className="nav-logo-container">
                    <img className="logo" src="/images/logo.png" alt="Logo" />
                </Link>
                <div className="nav-menu">
                    <ul className="nav-menu-list">
                        <li className="nav-item">
                            <Link to="/home" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
