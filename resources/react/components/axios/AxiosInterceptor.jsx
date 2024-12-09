import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageContext } from '../../contexts/MessageContext';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});



const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const [isSetup, setIsSetup] = useState(false);
    const { setMessage } = useContext(MessageContext);
    useEffect(() => {
        const interceptors = instance.interceptors.response.use(
            response => {
                if(response.config.url === '/register' && response.status === 201) {
                    console.log('Axios: Registration successful');
                    setMessage(response.data?.message);
                    navigate('/email/verify');
                }
                else if(response.config.url === '/login' && response.status === 200) {
                    console.log('Axios: Login successful');
                    setMessage(response.data?.message);
                    navigate('/home');
                }
                else if(response.config.url === '/logout' && response.status === 200) {
                    console.log('Axios: Logout successful');
                    setMessage(response.data?.message);
                    navigate('/login');
                }
                else if(/\/email\/verify\/[0-9]+\/[^\/]+/.test(response.config.url) && response.status === 200) {
                    console.log('Axios: Email verification');
                    setMessage(response.data?.message);
                    //navigate('/email/verify');
                }
                return response;
            },
            error => {
                if(error.code === 'ECONNABORTED') {
                    console.error("Error: Request timeout");
                    console.error(error);
                }
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                console.log(error);
                //More interceptors can be added here
                return Promise.reject(error);
            }
        );

        setIsSetup(true);
        return () => instance.interceptors.response.eject(interceptors);
    }, [navigate]);

    return isSetup && children;
}

export { instance, AxiosInterceptor };
