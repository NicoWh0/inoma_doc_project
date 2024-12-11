// resources/react/app.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import { AxiosInterceptor } from './components/axios/AxiosInterceptor';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AxiosInterceptor>
                    <Main />
                </AxiosInterceptor>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
