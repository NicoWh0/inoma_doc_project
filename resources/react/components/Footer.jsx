import React from "react";
import { Link } from 'react-router-dom';

export default function Footer() {

    const handleClick = () => {
        window.open('/pdf/privacy.pdf', '_blank');
    }

    return (
        <footer id="footer">
            <p>
                Copyright @ 2024 Inoma srl. Tutti i diritti riservati.
                <button onClick={handleClick} className="privacy-link"> Privacy Policy </button><br/>
                P.IVA 02507000020 - R.E.A. BI 192615
            </p>
        </footer>
    );
}
