import React from "react";

export default function UsernameForm(props) {
    return (
        <form method="PUT" onSubmit={props.handleUsernameFormSubmit} className={`profile-username-form ${props.isUsernameFormOpen && "expanded"}`}>
            <div className="username-form-input">
                <label>Nuovo username:</label>
                <input
                    onChange={props.handleUsernameFormChange}
                    type="text"
                    name="username"
                    placeholder={props.user.username}
                    value={props.usernameForm}
                />
            </div>
            <button type="submit" className="username-form-button"><span>Aggiorna</span></button>
            <div className="username-form-footer">
                <small>
                    Ricorda che il nome utente deve essere composto da sole lettere e numeri.<br/>
                    Inoltre la sua lunghezza deve essere compresa tra 4 e 32 caratteri.
                </small>
            </div>
        </form>
    )
}
