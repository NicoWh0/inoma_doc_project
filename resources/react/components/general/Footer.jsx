import React from "react";
import { Link } from 'react-router-dom';

export default function Footer() {

    const handleClickPrivacy = () => {
        window.open('/pdf/privacy.pdf', '_blank');
    }

    const handleClickPolicy = () => {
        window.open('/pdf/politica_aziendale.pdf', '_blank');
    }

    return (
        <footer id="footer">
            <p>
                Copyright @ 2024 Inoma srl. Tutti i diritti riservati.<br/>
                <button onClick={handleClickPrivacy} className="footer-link"> Privacy Policy </button>|
                <button onClick={handleClickPolicy} className="footer-link"> Politica Aziendale </button><br/>
                P.IVA 02507000020 - R.E.A. BI 192615
            </p>
        </footer>
    );
}
