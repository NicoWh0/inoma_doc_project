import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import clsx from "clsx";

export default function Header({ isHomePage }) {
    const [isAtTop, setIsAtTop] = React.useState(true);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        console.log("toggleMenu");
        setIsMenuOpen(isMenuOpen => !isMenuOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY <= 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    const navbarClasses = clsx({
        "navbar": true,
        "transparent": isAtTop && isHomePage,
        "opaque": !isAtTop || !isHomePage,
        "menu-open": isMenuOpen,
    });

    return (
        <header id="header" className={isHomePage ? "fixed":""}>
            <nav className={navbarClasses}>
                <div className="navbar-main-content">
                    <Link to="/home" className="nav-logo-container">
                        <img className="logo" src="/images/logo.png" alt="Logo" />
                    </Link>
                    <button onClick={toggleMenu} className="nav-toggle"><p>≡</p></button>
                    <div className="nav-menu">
                        <ul className="nav-menu-list">
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">Registrati</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                    <ul className="mobile-menu-list">
                        <li className="mobile-menu-item">
                            <Link to="/home" className="mobile-menu-link">Home</Link>
                        </li>
                        <li className="mobile-menu-item">
                            <Link to="/login" className="mobile-menu-link">Login</Link>
                        </li>
                        <li className="mobile-menu-item">
                            <Link to="/register" className="mobile-menu-link">Registrati</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
