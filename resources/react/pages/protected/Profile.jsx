import React from 'react';
import { Link } from 'react-router-dom';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import { AuthContext } from '../../contexts/AuthContext';

export default function Profile() {
    const { user } = React.useContext(AuthContext);

    return (
        <div className="profile-page">
            {user ?
            <>
                <h1>Il tuo <span className="color-red">Profilo</span></h1>
                <p>Benvenuto nella tua area riservata, {user.username}!</p>
                <Link to="/enable-2fa">Enable 2FA</Link>
            </> :
            <>
                <h1>Il tuo <span className="color-red">Profilo</span></h1>
                <p>Caricamento del profilo...</p>
            </>
        }
        </div>
    );
}
