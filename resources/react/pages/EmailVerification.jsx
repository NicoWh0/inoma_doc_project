import React, { useEffect } from "react";
import {instance as axios } from '../components/axios/AxiosInterceptor';
import { useParams } from 'react-router-dom';

export default function EmailVerification() {
    const { id, hash } = useParams();

    useEffect(() => {
        axios.get(`/email/verify/${id}/${hash}`)
            .then(response => {
                console.log('Email verification:', response);
            })
            .catch(error => {
                console.error('Error verifying email:', error);
            });
    }, [id, hash]);

    return (
        <>
            <h1>Email Verification</h1>
            <p>Verification in process...</p>
        </>
    );
};
