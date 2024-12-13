import React, { useState, useContext, use } from 'react';
import { Link } from 'react-router-dom';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from '../../components/general/Loader';
import UsernameForm from '../../components/profile/UsernameForm';


function UsernameSuccess({setUsernameSuccess, visible}) {
    const handleClosure = () => {
        setUsernameSuccess(false);
    }
    return (
        <div className={`profile-username-success ${visible && "visible"}`}>
            <div className="profile-username-success-button-container">
                <button onClick={handleClosure} className="profile-username-success-button">x</button>
            </div>
            <p>Username aggiornato con successo!</p>
        </div>
    );
}

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [isUsernameFormOpen, setIsUsernameFormOpen] = useState(false);
    const [usernameForm, setUsernameForm] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState(false);

    const handleToggleUsernameForm = () => {
        setIsUsernameFormOpen(isUsernameFormOpen => !isUsernameFormOpen);
        if(!isUsernameFormOpen) setUsernameForm('');
    }

    const handleUsernameFormChange = (e) => {
        const {value} = e.target;
        if(value.length > 32 && value.length > usernameForm.length) return;
        setUsernameForm(e.target.value);
    }

    const handleUsernameFormSubmit = (e) => {
        e.preventDefault();
        console.log('Username form submitted:', usernameForm);
        axios.put('/user/me/change-username', {username: usernameForm})
            .then(response => {
                console.log('Username updated:', response.data);
                setUser({...user, username: usernameForm});
                setIsUsernameFormOpen(false);
                setUsernameSuccess(true);
            })
            .catch(error => {
                console.error('Error updating username:', error);
            });
    }

    const role = ((user) => {
        if(!user) return null;
        switch(user.type) {
            case 0:
                return 'Standard';
            case 1:
                return 'Amministratore';
            case 2:
                return 'Super Amministratore';
            default:
                return 'Invalid';
        }
    })(user);

    const roleParagraph = (user) => {
        if(!user) return null;
        switch(user.type) {
            case 0:
                return <p className="profile-info-text">Il tuo ruolo può essere modificato solo da un utente di grado amministratore o superiore.</p>;
            case 1:
                return <p className="profile-info-text">Il tuo ruolo può essere modificato solo dal super amministratore, in caso di emergenza.</p>;
            case 2:
                return <p className="profile-info-text">Il tuo ruolo non può essere modificato.</p>;
            default:
                return <p className="profile-info-text">Errore nel recupero del ruolo.</p>;
        }
    }

    return (
        <div className="profile-page">
            {user ?
                <div className="profile">
                    <div className="profile-intro">
                        <h1>Il tuo <span className="color-red">Profilo</span></h1>
                        <h2>Un benvenuto nella tua <span className="color-red">area riservata</span>, {user.username}!</h2>
                        <p>Qui puoi modificare le tue credenziali e gestire l'abilitazione per l'autenticazione a due fattori.</p>
                    </div>
                    <div className="profile-info-container">
                        <h2>Informazioni <span className="color-red">utente</span></h2>
                        <div className="profile-info">
                            <p className="profile-info-value"><span className="color-red bold">Email:</span> {user.email}</p>
                            <p className="profile-info-text">L'email non è modificabile!</p>
                        </div>
                        <div className="profile-info">
                            <div className="profile-username-header">
                                <p className="profile-info-value"><span className="color-red bold">Username:</span> {user.username}</p>
                                <button onClick={handleToggleUsernameForm} className="profile-button">
                                    <span>{isUsernameFormOpen ? "Annulla" : "Modifica"}</span>
                                </button>
                            </div>
                            <div className="profile-username-form-container">
                                <UsernameForm
                                    isUsernameFormOpen={isUsernameFormOpen}
                                    user={user}
                                    usernameForm={usernameForm}
                                    handleUsernameFormChange={handleUsernameFormChange}
                                    handleUsernameFormSubmit={handleUsernameFormSubmit}
                                />
                            </div>
                            <UsernameSuccess visible={usernameSuccess} setUsernameSuccess={setUsernameSuccess} />
                        </div>
                        <div className="profile-info no-border">
                            <p className="profile-info-value"><span className="color-red bold">Ruolo:</span> {role}</p>
                            {roleParagraph(user)}
                        </div>
                    </div>
                    <div className="profile-auth-container">
                        <h2>Accesso e <span className="color-red">Sicurezza</span></h2>
                        <div className="profile-change-password">
                            <h4><span className="color-red">Password:</span> **********</h4>
                            <div className="profile-info">
                                <button className="profile-button"><span>Modifica</span></button>
                            </div>
                        </div>
                        <div className="profile-2fa">
                            <h4>Autenticazione a <span className="color-red">due fattori</span></h4>
                            <div className="profile-2fa-info">
                                <p><span className="color-red bold">Stato: </span> {user.google2fa_enabled ? "Abilitata" : "Disabilitata"}</p>
                                <Link to={user.google2fa_enabled ? "/disable-2fa" : "/enable-2fa"} className="profile-button">
                                    <span>{user.google2fa_enabled ? "Disabilita" : "Abilita"}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            :
                <>
                    <Loader/>
                </>
            }
        </div>
    );
}
