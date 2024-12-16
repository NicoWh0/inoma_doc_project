import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/general/Loader";
import Form2FA from "../../components/general/Form2FA";
import PopupSuccess from "../../components/general/PopupSuccess";
import PopupFailure from "../../components/general/PopupFailure";

export default function Enable2FA() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [totpCode, setTotpCode] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const handleOnChange = (e) => {
        setTotpCode(e.target.value);
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        axios.post('/user/me/enable-2fa/verify', {code: totpCode})
            .then(response => {
                setSuccess(true);
                setUser(user => ({...user, google2fa_enabled: true}));
                console.log('2FA enabled:', response.data);
            })
            .catch(error => {
                console.error('Error enabling 2FA:', error);
                setError(true);
                setErrMessage('Codice 2FA non valido. Riprova.');
            });
    }

    useEffect(() => {
        axios.post('/user/me/enable-2fa/request')
            .then(response => {
                setQrCodeUrl(response.data.qrCodeUrl);
            })
            .catch(error => {
                console.error('Error QR Code request:', error);
                setError(true);
                setErrMessage('Errore nella richiesta del QR Code. Riprova più tardi.');
            });
    }, []);

    return (
        qrCodeUrl ?
        <div className="enable-2fa-page">
            <PopupSuccess open={success} onClose={() => {
                setSuccess(false);
                navigate('/profile');
            }} message="2FA abilitata con successo!" />
            <PopupFailure open={error} onClose={() => {
                setError(false);
                setErrMessage('');
                setTotpCode('');
            }} message={errMessage} />
            <div className="enable-2fa-page-header">
                <h1 className="enable-2fa-page-title">Abilitazione <span className="color-red">Autenticazione a due fattori</span></h1>
                <p className="enable-2fa-page-subtitle">Scansiona il QR Code qua sotto con la telecamera del tuo smartphone.</p>
            </div>
            <div className="qr-code-container">
                <img className="qr-code" src={qrCodeUrl} alt="2FA QR Code" />
            </div>
            <p className="qr-code-instructions">
                    Una volta scansionato il QR Code, inserisci il codice presente nella tua applicazione (<em>e.g. Google Authenticator</em> ) per attivare la 2FA:
            </p>
            <div className="form-enable-2fa-container">
                <Form2FA handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} code={totpCode} />
            </div>
            <p className="enable-2fa-go-back">Se hai cambiato idea, puoi sempre tornare <Link to="/profile">al tuo profilo</Link>.</p>
        </div>
            :
        <Loader />
    );
}
