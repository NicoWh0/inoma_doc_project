// resources/react/app.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import { AxiosInterceptor } from './components/axios/AxiosInterceptor';
import { MessageContext, MessageProvider } from './contexts/MessageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <MessageProvider>
                <AxiosInterceptor>
                    <Main />
                </AxiosInterceptor>
            </MessageProvider>
        </BrowserRouter>
    </React.StrictMode>
);
