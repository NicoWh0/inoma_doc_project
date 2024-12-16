import React, { useContext, useState } from "react";
import { instance as axios } from "../../components/axios/AxiosInterceptor";
import { AuthContext } from "../../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from "../../components/general/Loader";
import Form2FA from "../../components/general/Form2FA";
import PopupFailure from "../../components/general/PopupFailure";
import PopupSuccess from "../../components/general/PopupSuccess";

export default function Page2FA() {
    const navigate = useNavigate();
    const searchParams = useSearchParams()[0];
    console.log('Search params:', searchParams);
    const { setUser } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const handleOnChange = (e) => {
        const value = e.target.value;
        if(/^\d{0,6}$/.test(value)) {
            setCode(value);
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log('2FA code submitted:', code);
        if(code.length < 6) return;
        const codeToSend = code;
        setCode('');
        switch(searchParams.get('context')) {
            case 'login':
                console.log('2FA Page: Login request');
                axios.post('/login/2fa', {code: codeToSend}).then(response => {
                    console.log('2FA Login response:', response.data);
                    setUser(response.data.user);
                }).catch(error => {
                    console.error('2FA Login error:', error);
                    setError(true);
                    if(error.response.status === 401)
                        setMessage('Codice 2FA non valido. Riprova.');
                    else if(error.response.status === 422)
                        setMessage('Il codice 2FA è obbligatorio. Inseriscilo nel campo apposito.');
                    else
                        setMessage('Errore durante il login. Riprova.');
                });
                break;
                case 'disable':
                    console.log('2FA Page: Disable request');
                    axios.post('/user/me/disable-2fa', {code: code}).then(response => {
                        console.log('2FA Disable response:', response.data);
                        setUser(user => ({...user, google2fa_enabled: false}));
                        setSuccess(true);
                        setMessage('2FA disabilitata con successo!');
                    }).catch(error => {
                        console.error('2FA Disable error:', error);
                        setError(true);
                        if(error.response.status === 401)
                            setMessage('Codice 2FA non valido. Riprova.');
                        else if(error.response.status === 422)
                            setMessage('Il codice 2FA è obbligatorio. Inseriscilo nel campo apposito.');
                        else
                            setMessage('Errore durante la disabilitazione del 2FA. Riprova.');
                    });
                    break;
            //more to add
            default:
                console.error('Invalid request type:', requestType);
        }
    }

    return (
        searchParams.get('context') ?
            <div className="page-2fa">
                <PopupFailure open={error} onClose={() => {
                    setError(false);
                    setMessage('');
                }} message={message} />
                <PopupSuccess open={success} onClose={() => {
                    setSuccess(false);
                    setMessage('');
                    navigate('/profile');
                }} message={message} />
                <div className="form-2fa-container">
                    <h1 className="form-2fa-title">Autenticazione <span className="color-red">a due fattori</span></h1>
                    <p className="form-2fa-description">
                        Per continuare, è richiesto il codice a 6 cifre. Lo puoi trovare nell'applicazione dedicata sul tuo smartphone.
                    </p>
                    <Form2FA handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} code={code}/>
                </div>
            </div>
                :
            <Loader/>
    );
}
