import React, { createContext, useState, useEffect } from "react";
import { instance as axios } from "../components/axios/AxiosInterceptor";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [done, setDone] = useState(false);

    const isAuthenticated = user !== null;

    useEffect(() => {
        axios.get('/user/me')
            .then(response => {
                console.log('User:', response.data);
                setUser(response.data);
                setDone(true);
            })
            .catch(error => {
                console.log('User not authenticated. Status: ', error.response.status);
                setDone(true);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, done }}>
            {children}
        </AuthContext.Provider>
    );
}
