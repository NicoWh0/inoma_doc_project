import React, { useState } from "react";
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import PopupSuccess from "../../components/general/PopupSuccess";
import PopupFailure from "../../components/general/PopupFailure";
import _ from 'lodash';
import DocForm from "../../components/documentation/DocForm";


export default function DocUpload({categories}) {
    const [uploadState, setUploadState] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e, formData) => {
        e.preventDefault();
        console.log('Document upload form submitted');
        console.log(formData);
        const sanizitedForm = {
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim()
        }
        axios.post('/documentation/docs', sanizitedForm, {headers: {
            'Content-Type': 'multipart/form-data'
        }}).then(response => {
            console.log('Document upload response:', response.data);
            setUploadState(1);
        }).catch(error => {
            console.error('Document upload error:', error);
            setUploadState(-1);
            setErrorMessage(error.response.data.message);
        });
    }

    return (
        <>
            <PopupSuccess
                open={uploadState === 1}
                onClose={() => setUploadState(0)} //TODO: Redirect to document page
                message="Documento caricato con successo!"
            />
            <PopupFailure
                open={uploadState === -1}
                onClose={() => setUploadState(0)}
                message={errorMessage}
            />
            <div className="doc-upload-title">
                <h1><span className="color-red">Carica</span> Documento</h1>
            </div>
            <div className="doc-upload-form-container">
                <DocForm
                    categories={categories}
                    handleSubmit={handleSubmit}
                />
            </div>
        </>
    );
}
