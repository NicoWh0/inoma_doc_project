import React, { useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { instance as axios } from '../components/axios/AxiosInterceptor';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import clsx from "clsx";

export default function Header({ isHomePage }) {
    const [isAtTop, setIsAtTop] = React.useState(true);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { setUser, isAuthenticated, done } = useContext(AuthContext);

    const toggleMenu = () => {
        console.log("toggleMenu");
        setIsMenuOpen(isMenuOpen => !isMenuOpen);
    }

    const handleLogout = () => {
        axios.delete('/logout')
            .then(_res => {
                console.log('Logout successful');
                setUser(null);
                Cookies.remove('XSRF-TOKEN');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
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

    const getNavLinks = () => {
        if(!done) return null;
        else if (isAuthenticated) {
            return (
                <>
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/documentation" className="nav-link">Documentazione</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">Profilo</Link>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    </li>
                </>
            );
        } else {
            return (
                <>
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register" className="nav-link">Registrati</Link>
                    </li>
                </>
            )
        }
    }

    const getNavMobileLinks = () => {
        if(!done) return null;
        else if(isAuthenticated) {
            return (
                <>
                    <li className="mobile-menu-item">
                        <Link to="/home" className="mobile-menu-link">Home</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/documentation" className="mobile-menu-link">Documentazione</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/profile" className="mobile-menu-link">Profilo</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <button onClick={handleLogout} className="mobile-menu-button">Logout</button>
                    </li>
                </>
            )
        } else {
            return (
                <>
                    <li className="mobile-menu-item">
                        <Link to="/home" className="mobile-menu-link">Home</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/login" className="mobile-menu-link">Login</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/register" className="mobile-menu-link">Registrati</Link>
                    </li>
                </>
            )
        }
    }

    const navbarClasses = clsx({
        "navbar": true,
        "transparent": isAtTop && isHomePage,
        "opaque": !isAtTop || !isHomePage,
        "menu-open": isMenuOpen,
    });


    return (
        <header id="header" className={isHomePage ? "fixed":"sticky"}>
            <nav className={navbarClasses}>
                <div className="navbar-main-content">
                    <Link to="/home" className="nav-logo-container">
                        <img className="logo" src="/images/logo.png" alt="Logo" />
                    </Link>
                    <button onClick={toggleMenu} className="nav-toggle"><p>≡</p></button>
                    <div className="nav-menu">
                        <ul className="nav-menu-list">
                            {getNavLinks()}
                        </ul>
                    </div>
                </div>
                <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                    <ul className="mobile-menu-list">
                        {getNavMobileLinks()}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
