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
            <h1 className="disable-2fa-title">Disattivazione <span className="color-red">Autenticazione a due fattori</span></h1>
            <div className="disable-2fa-content">
                <div className="disable-2fa-text">
                    <p>Sei veramente sicuro di disattivare l'autenticazione a doppio fattore?</p>
                    <p>
                        L'autenticazione a doppio fattore ti aiuta a proteggere il tuo account aggiungendo un ulteriore livello di sicurezza.
                    </p>
                </div>
                <div className="btn-group">
                    <button className="disable-button" onClick={handleDisable}>Disattiva</button>
                    <button className="cancel-button" onClick={handleCancel}>Annulla</button>
                </div>
            </div>
        </div>
    )
}
