import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from 'react-router-dom';

export default function EmailVerified() {
    const { setUser } = useContext(AuthContext);
    useEffect(() => {
        setUser(user => ({ ...user, email_verified: true }));
    }, []);

    return (
        <div className="email-verification-notification">
            <h1 className="email-verification-title"><span className='color-red'>Registrazione</span> effettuata</h1>
            <p className="email-verification-text">
                La tua email è stata verificata con successo. Ora puoi iniziare ad utilizzare il nostro servizio.
            </p>
            <Link to="/profile" className="email-verification-link">Vai al tuo profilo</Link>
        </div>
    )
}
