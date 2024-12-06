import React from "react";

export default function Login() {
    return (
        <div className="login-page">
            <h1>Accedi</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username o Email</label>
                    <input type="text" id="identifier" name="identifier" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                </div>
            </form>
        </div>
    )
}
