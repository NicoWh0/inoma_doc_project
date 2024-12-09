import React from 'react';

export default function EmailVerificationNotification() {
    return (
        <div className="email-verification-notification">
            <h1>Registrazione effettuata</h1>
            <p>Ti abbiamo mandato una mail di verifica. Controlla la tua casella di posta.</p>
            <p>Non hai ricevuto nessuna mail? Riprova con un pulsante qua sotto</p>
            <button>Invia di nuovo la mail di verifica</button>
        </div>
    )
}
