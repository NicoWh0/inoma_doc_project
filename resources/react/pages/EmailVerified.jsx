import React from "react";

export default function EmailVerified() {
    return (
        <div className="email-verification-notification">
            <h1 className="email-verification-title"><span className='color-red'>Registrazione</span> effettuata</h1>
            <p className="email-verification-text">
                La tua email è stata verificata con successo. Ora puoi iniziare ad utilizzare il nostro servizio.
            </p>
        </div>
    )
}
