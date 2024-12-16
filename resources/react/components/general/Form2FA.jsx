import React from "react";

export default function Form2FA({ handleOnSubmit, handleOnChange, code }) {
    return (
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
    )
}
