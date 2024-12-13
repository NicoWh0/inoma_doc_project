import React, { useContext, useEffect, useState } from "react";
import { instance as axios } from "../../components/axios/AxiosInterceptor";
import { AuthContext } from "../../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import Loader from "../../components/general/Loader";

export default function Page2FA() {
    const searchParams = useSearchParams()[0];
    console.log('Search params:', searchParams);
    const { setUser } = useContext(AuthContext);
    const [code, setCode] = useState('');

    useEffect(() => {
        //Clean up
        return () => {
            setCode('');
        }
    }, []);

    const handleOnChange = (e) => {
        const value = e.target.value;
        if(/^\d{0,6}$/.test(value)) {
            setCode(value);
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log('2FA code submitted:', code);
        switch(searchParams.get('context')) {
            case 'login':
                console.log('2FA Page: Login request');
                axios.post('/login/2fa', {code: code}).then(response => {
                    console.log('2FA Login response:', response.data);
                    setUser(response.data.user);
                }).catch(error => {
                    console.error('2FA Login error:', error);
                });
                break;
                case 'disable':
                    console.log('2FA Page: Disable request');
                    axios.post('/user/me/disable-2fa', {code: code}).then(response => {
                        console.log('2FA Disable response:', response.data);
                        setUser(user => ({...user, twoFactorEnabled: false}));
                    }).catch(error => {
                        console.error('2FA Disable error:', error);
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
                <div className="form-2fa-container">
                    <h1 className="form-2fa-title">Autenticazione <span className="color-red">a due fattori</span></h1>
                    <p className="form-2fa-description">
                        Per continuare, è richiesto il codice a 6 cifre. Lo puoi trovare nell'applicazione dedicata sul tuo smartphone.
                    </p>
                    <form className="form-2fa" onSubmit={handleOnSubmit}>
                        <label htmlFor="code">Codice:</label>
                        <input
                            id="code"
                            inputMode="numeric"
                            onChange={handleOnChange}
                            type="text"
                            value={code}
                            placeholder="XXX-XXX"
                            onKeyUp={(e) => { if(e.key === 'Enter') handleOnSubmit(e); }}
                        />
                        <button disabled={code.length < 6} className="totp-submit-button" type="submit">Invia codice</button>
                    </form>
                </div>
            </div>
                :
            <Loader/>
    );
}
