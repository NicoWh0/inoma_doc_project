import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import Loader from "../../components/general/Loader";

export default function Enable2FA() {

    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [totpCode, setTotpCode] = useState('');

    const handleOnChange = (e) => {
        setTotpCode(e.target.value);
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        axios.post('/user/me/enable-2fa/verify', {code: totpCode})
            .then(response => {
                console.log('2FA enabled:', response.data);
            })
            .catch(error => {
                console.error('Error enabling 2FA:', error);
            });
    }

    useEffect(() => {
        axios.post('/user/me/enable-2fa/request')
            .then(response => {
                console.log('2FA request response:', response.data);
                setQrCodeUrl(response.data.qrCodeUrl);
            })
            .catch(error => {
                console.error('Error enabling 2FA:', error);
        });
    }, []);

    return (
        qrCodeUrl ?
        <div className="enable-2fa-page">
            <h1>Abilitazione Autenticazione a due fattori</h1>
            <p>Scansiona il QR Code qua sotto con la telecamera del tuo smartphone</p>
            <img src={qrCodeUrl} alt="2FA QR Code" />
            <form onSubmit={handleOnSubmit}>
                <p>Una volta scansionato il QR Code, inserisci il codice presente nella tua applicazione per attivare la 2FA:</p>
                <label>Inserisci il codice: </label>
                <input
                    onChange={handleOnChange}
                    type="text"
                    value={totpCode}
                />
                <button type="submit">Invia codice</button>
            </form>
            <Link to="/profile">Torna al profilo</Link>
        </div>
            :
        <Loader />
    );
}
