import React, { createContext, useState } from 'react';

export const TwoFactorAuthContext = createContext();

export const TwoFactorAuthProvider = ({ children }) => {
    const [twoFactorContext, setTwoFactorContext] = useState('');

    return (
        <TwoFactorAuthContext.Provider value={{ twoFactorContext, setTwoFactorContext }}>
            {children}
        </TwoFactorAuthContext.Provider>
    );
}
