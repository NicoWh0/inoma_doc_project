import React from 'react';
import '../../../css/email-verify-notice.css';
import { instance as axios } from '../../components/axios/AxiosInterceptor';

export default function EmailVerificationNotification() {

    const resendMailToken = () => {
        axios.post('/email/verification-notification')
            .then(response => {
                console.log('Email verification notification:', response);
            })
            .catch(error => {
                console.error('Error resending email verification notification:', error);
            });
    }

    return (
        <div className="email-verification-notification">
            <h1 className="email-verification-title"><span className='color-red'>Registrazione</span> effettuata</h1>
            <p className="email-verification-text">
                Per sbloccare le piene funzionalità del tuo account, conferma la tua email.<br/>
                Ti abbiamo mandato una mail di verifica. Controlla la tua casella di posta.
            </p>
            <p className="email-verification-text">Non hai ricevuto nessuna mail? Riprova con il pulsante qua sotto.</p>
            <button onClick={resendMailToken} className="resend-mail-token-btn">Invia di nuovo la mail di verifica</button>
        </div>
    )
}
