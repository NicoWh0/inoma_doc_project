import React, {useState, useContext } from "react";
import { Link } from "react-router-dom";
import { instance as axios } from "../../components/axios/AxiosInterceptor";
import { AuthContext } from "../../contexts/AuthContext";
import PopupFailure from "../../components/general/PopupFailure";

export default function Login() {
    const [failed, setFailed] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const { setUser } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login form submitted');
        console.log(formData);
        axios.post('/login', formData)
            .then(response => {
                console.log("Login Page: login successful");
                if(!response.data.require2fa) {
                    setUser(response.data.user);
                }
            })
            .catch(error => {
                console.error(error);
                console.log("Login Page: login failed");
                setFailed(true);
            });
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevformData => (
            {...prevformData, [name]: value}
        ));
    }

    return (
        <div className="login-page">
            <PopupFailure open={failed} onClose={() => setFailed(false)} message="Credenziali non valide. Riprova." />
            <h1 className="login-title"><span className="color-red">Accedi</span> alla piattaforma</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="identifier">Username o Email</label>
                    <input
                        onInvalid={(e) => e.target.setCustomValidity('Inserire username o email.')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        onChange={handleChange}
                        type="text"
                        id="identifier"
                        name="identifier"
                        placeholder="Inserire username o email"
                        value={formData.identifier}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onInvalid={(e) => e.target.setCustomValidity('Inserire una password.')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        onChange={handleChange}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Inserire la password"
                        value={formData.password}
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="login-submit-btn">Login</button>
                </div>
            </form>
            <div className="login-footer">
                <p className="login-footer-text">Non hai un account? <Link to="/register">Registrati</Link></p>
                <p className="login-footer-text">Hai dimenticato la password? <Link to="/reset-password">Recuperala</Link></p>
            </div>
        </div>
    )
}
