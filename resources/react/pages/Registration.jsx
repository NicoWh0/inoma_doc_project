import React, { useState } from "react";
import { Link, redirect, useNavigate } from 'react-router-dom';
import '../../css/registration.css';
import axios from "axios";

export default function Registration() {

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const testRegex = (regex, value, errorMessage, event) => {
        if(!regex.test(value)) event.target.setCustomValidity(errorMessage);
        else event.target.setCustomValidity("");
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevformData => (
            {...prevformData, [name]: value}
        ));
        switch(name) {
            case 'email':
                if(e.target.validity.valueMissing) e.target.setCustomValidity("Inserire una mail");
                else {
                    testRegex(
                        /\S+@\S+\.\S+/,
                        value,
                        "Inserire una mail valida",
                    e);
                }
                break;
            case 'username':
                if(e.target.validity.valueMissing) e.target.setCustomValidity("Inserire un nome utente");
                else {
                    testRegex(
                        /^[a-zA-Z0-9]{4,32}$/,
                        value,
                        "Il nome utente deve contenere solo lettere o numeri",
                    e);
                }
                break;
            case 'password':
                if(e.target.validity.valueMissing) e.target.setCustomValidity("Inserire una password");
                else {
                    testRegex(
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,16}$/,
                        value,
                        "La password deve contenere almeno 10 caratteri, una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale",
                    e);
                }
                break;
            case 'confirmPassword':
                if(e.target.validity.valueMissing) e.target.setCustomValidity("Confermare la password");
                else if(value !== formData.password) e.target.setCustomValidity("Le password non corrispondono");
                else e.target.setCustomValidity("");
                break;
            default:
                console.log("Form: this message should never appear. If it appears, it's a bug.");
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //submit to api
        console.log(formData);
        //add the csrf token
        axios.post('/api/register', formData, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        }).then(response => {
            console.log(response);
            //useNavigate().navigate('/login'); Da usare con useEffect o qualcosa del genere
        }).catch(error => {
            console.log(error);
        });
    }

    const handlePolicyClick = () => {
        window.open('/pdf/politica_aziendale.pdf', '_blank');
    }
    const handlePrivacyClick = () => {
        window.open('/pdf/privacy.pdf', '_blank');
    }

    return (
        <div className="registration-page">
            <div className="registration-title">
                <h1><span className="color-red">Registrati</span> alla piattaforma</h1>
                <p>Registrati al nostro servizio per poter scaricare la tua documentazione aziendale.<br/>Bastano pochi passi!</p>
            </div>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <div className="form-group-input-box">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Inserire una mail"
                            value={formData.email}
                            required
                        />
                    </div>
                    <div className="form-group-description">
                        <small className="form-text">
                            Inserisci un indirizzo email valido.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group-input-box">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Inserire un nome utente"
                            value={formData.username}
                            required
                        />
                    </div>
                    <div className="form-group-description">
                        <small className="form-text">
                            Il nome utente deve contenere solo lettere o numeri.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group-input-box">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Inserire una password"
                            value={formData.password}
                            required
                        />
                    </div>
                    <div className="form-group-description">
                        <small className="form-text">
                            La password deve contenere almeno 10 caratteri, una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group-input-box">
                        <label htmlFor="confirmPassword">Conferma Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confermare la password"
                            value={formData.confirmPassword}
                            required
                        />
                    </div>
                    <div className="form-group-description">
                        <small className="form-text">
                            Conferma la password inserita precedentemente.
                        </small>
                    </div>
                </div>
                <button type="submit" className="submit-button">Registrati</button>
            </form>
            <div className="registration-footer">
                <p>Sei già registrato? <Link to="/login">Accedi</Link></p>
                <p>Registrandoti al sito accetti la nostra <a href="#" onClick={handlePolicyClick}>Politica aziendale</a> e la nostra <a href="#" onClick={handlePrivacyClick}>Informativa sulla Privacy</a>.</p>
            </div>
        </div>
    )
}
