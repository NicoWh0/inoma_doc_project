import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { MessageContext } from '../../contexts/MessageContext';

const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 10000,
    headers: {
        //'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
});

const onRequest = async (config) => {
    if((
        config.method === 'post' ||
        config.method === 'put' ||
        config.method === 'delete'
        ) && !Cookies.get('XSRF-TOKEN')
    ) {
        await setCSRFToken();
    }
    return config;
}

const setCSRFToken = () => {
    return instance.get('/csrf-cookie');
}

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const [isSetup, setIsSetup] = useState(false);
    useEffect(() => {
        const configUse = instance.interceptors.request.use(onRequest);
        const interceptors = instance.interceptors.response.use(
            response => {
                switch(true) {
                    case response.config.url === '/register' && response.status === 201:
                        console.log('Axios: Registration successful');
                        navigate('/email/verify/notice');
                        break;
                    case response.config.url === '/login' && response.status === 200:
                        console.log('Axios: Login successful');
                        navigate('/home');
                        break;
                    case response.config.url === '/logout' && response.status === 200:
                        console.log('Axios: Logout successful');
                        navigate('/login');
                        break;
                    case /\/email\/verify\/[0-9]+\/[^\/]+/.test(response.config.url) && response.status === 200:
                        console.log('Axios: Email verification');
                        break;
                    //More response handling can be added here
                    default:
                        break;
                }
                return response;
            },
            error => {
                switch(true) {
                    case error.code === 'ECONNABORTED':
                        console.error("Error: Request timeout");
                        console.error(error);
                        break;
                    case error.config.url === '/user/me' && error.response.status === 401:
                        console.log('User not authenticated');
                        break;
                    case error.response?.status === 401:
                        navigate('/login');
                        break;
                    //More error handling can be added here
                    default:
                        break;
                }
                return Promise.reject(error);
            }
        );

        setIsSetup(true);
        return () => {
            instance.interceptors.response.eject(interceptors);
            instance.interceptors.request.eject(configUse);
        }
    }, [navigate]);

    return isSetup && children;
}

export { instance, AxiosInterceptor, setCSRFToken };
