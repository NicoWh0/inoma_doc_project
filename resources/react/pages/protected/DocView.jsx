import React, { useState, useEffect } from 'react';
import { data, Link, useParams } from 'react-router-dom';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import Loader from '../../components/general/Loader';
import { last } from 'lodash';

export default function DocView() {
    const params = useParams();
    const [docData, setDocData] = useState({});
    const [categories, setCategories] = useState([]);
    const [done, setDone] = useState(false);

    const dataFormat = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }

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
            console.log('Document data:', response.data);
            setDocData({
                title: response.data.title,
                description: response.data.description ?? '',
                category_id: response.data.category_id,
                users: response.data.users,
                uploadedAt: response.data.created_at,
                lastModified: response.data.updated_at
            });
            setDone(true);
        }).catch(error => {
            console.error('Error fetching document data:', error);
        });
    }, [params]);

    const renderUsers = () => {
        return docData.users.map((user, index) => {
            return (
                <div key={index}>
                    <p><span className="color-red">Utente: </span>{user.username}</p>
                    <p><span className="color-red">Email: </span>{user.email}</p>
                </div>
            );
        });
    }

    return (
        !done ? <Loader /> :
        <div className="doc-view-page">
            <h1><span className="color-red">Visualizza</span> Documento</h1>
            <Link to={`/documentation/management`}>Torna alla gestione</Link>
            <div className="doc-view-container">
                <div className="doc-view-main-info">
                    <h2><span className="color-red">Titolo: </span>{docData.title}</h2>
                    <p><span className="color-red">Categoria: </span>{categories[docData.category_id]}</p>
                    <p><span className="color-red">Descrizione: </span>{docData.description}</p>
                </div>
                <div className="doc-view-users">
                    <h2>Utenti con accesso:</h2>
                    <div>
                        <p>Numero di utenti: {docData.users.length}</p>
                        {renderUsers()}
                    </div>
                </div>
                <div className="doc-view-dates">
                    <p><span className="color-red">Caricato: </span>{new Date(docData.uploadedAt).toLocaleString('it-IT', dataFormat)}</p>
                    <p><span className="color-red">Ultima modifica: </span>{new Date(docData.lastModified).toLocaleString('it-IT', dataFormat)}</p>
                </div>
                <div className="doc-view-links">
                    <Link to={`/documentation/management/${params.id}/edit`}>Modifica documento</Link>
                    <Link>Scarica documento</Link>
                </div>
            </div>
        </div>
    );
}
