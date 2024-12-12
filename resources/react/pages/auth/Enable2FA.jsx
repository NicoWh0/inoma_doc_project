import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { instance as axios } from '../../components/axios/AxiosInterceptor';

export default function Enable2FA() {

    const [qrCodeUrl, setQrCodeUrl] = React.useState(null);

    useEffect(() => {
        axios.post('/enable-2fa')
            .then(response => {
                console.log('2FA enabled:', response.data);
                setQrCodeUrl(response.data.qrCodeUrl);
            })
            .catch(error => {
                console.error('Error enabling 2FA:', error);
        });
    }, []);

    return (
        <div>
            <h1>Enable 2FA</h1>
            <p>Enable 2FA page content</p>
            {qrCodeUrl ? (<img src={qrCodeUrl} alt="2FA QR Code" />) : ("Loading QR Code...")}
            <Link to="/profile">Back to Profile</Link>
        </div>
    );
}
