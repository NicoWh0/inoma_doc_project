import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import PopupSuccess from "../../components/general/PopupSuccess";
import PopupFailure from "../../components/general/PopupFailure";
import _, { isNumber } from 'lodash';
import DocForm from "../../components/documentation/DocForm";
import Loader from "../../components/general/Loader";


export default function DocModify() {
    const params = useParams();
    const [uploadState, setUploadState] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [docData, setDocData] = useState({
        title: '',
        description: '',
        category_id: null,
        users: []
    });
    const [categories, setCategories] = useState([]);
    const [done, setDone] = useState(false);


    useEffect(() => {
        axios.get('api/categories')
            .then(response => {
                console.log('Categories:', response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    useEffect(() => {
        console.log('DocModify params:', params);
        axios.get(`/documentation/docs/${params.id}`).then(response => {
            console.log('Document data:', response.data.document);
            const document = response.data.document;
            setDocData({
                title: document.title,
                description: document.description ?? '',
                category_id: document.category_id,
                users: document.users
            });
            setDone(true);
        }).catch(error => {
            console.error('Error fetching document data:', error);
        });
    }, [params]);

    const handleSubmit = (e, formData) => {
        e.preventDefault();
        console.log('Document modify form submitted');
        console.log(formData);

        const sanizitedForm = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            users: formData.users
        }
        if(formData.users.length > 0 && formData.users.every(user => !isNumber(user))) {
            sanizitedForm.users = formData.users.map(user => user.id);
        }
        console.log("Sanizited: ", sanizitedForm);

        axios.put(`/documentation/docs/${params.id}`, sanizitedForm).then(response => {
            console.log('Document modify response:', response.data);
            setUploadState(1);
        }).catch(error => {
            console.error('Document modify error:', error);
            setUploadState(-1);
            setErrorMessage(error.response.data.message);
        });
    }

    return (
        <div className="doc-manager-page">
            <PopupSuccess
                open={uploadState === 1}
                onClose={() => setUploadState(0)} //TODO: Redirect to document page
                message="Documento modificato con successo!"
            />
            <PopupFailure
                open={uploadState === -1}
                onClose={() => setUploadState(0)}
                message={errorMessage}
            />
            <div className="doc-upload-title">
                <h1><span className="color-red">Modifica</span> Documento</h1>
            </div>
            <div className="doc-upload-form-container">
                {
                    !done ? <Loader/>
                        :
                    <DocForm
                        categories={categories}
                        handleSubmit={handleSubmit}
                        modify={true}
                        docData={docData}
                    />
                }

            </div>
        </div>
    );
}
