import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Disable2FA() {
    const navigate = useNavigate();

    //setTwoFactorContext('disable');
    //navigate('/page-2fa');

    const handleDisable = () => {
        navigate('/page-2fa?context=disable');
    }

    const handleCancel = () => {
        navigate('/profile');
    }

    return (
        <div className="disable-2fa-page">
            <h1>Disattivazione Autenticazione a doppio fattore</h1>
            <div>
                <p>Sei veramente sicuro di disattivare l'autenticazione a doppio fattore?</p>
                <p>
                    L'autenticazione a doppio fattore ti aiuta a proteggere il tuo account aggiungendo un ulteriore livello di sicurezza.
                </p>
                <div className="btn-group">
                    <button onClick={handleDisable}>Disattiva</button>
                    <button onClick={handleCancel}>Annulla</button>
                </div>
            </div>
        </div>
    )
}
