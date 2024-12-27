import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import Loader from '../../components/general/Loader';

export default function DocView() {
    const params = useParams();
    const [docData, setDocData] = useState({});
    const [categories, setCategories] = useState([]);
    const [done, setDone] = useState(false);
    const [isDescOverflowing, setIsDescOverflowing] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const mainInfoRef = useRef(null);
    const descriptionRef = useRef(null);
    const [areUsersOverflowing, setAreUsersOverflowing] = useState(false);
    const [areUsersExpanded, setAreUsersExpanded] = useState(false);
    const usersBoxRef = useRef(null);
    const usersListRef = useRef(null);

    const dataFormat = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }

    const checkOverflow = () => {
        const mainInfoElement = mainInfoRef.current;
        const descElement = descriptionRef.current;
        const usersBoxElement = usersBoxRef.current;
        const usersListElement = usersListRef.current;
        if (mainInfoElement && descElement && !mainInfoElement.classList.contains('expanded')) {
            setIsDescOverflowing(descElement.scrollHeight > descElement.clientHeight);
        }
        if (usersBoxElement && usersListElement && !usersBoxElement.classList.contains('expanded')) {
            setAreUsersOverflowing(usersBoxElement.scrollHeight > usersBoxElement.clientHeight);
        }
    };

    useEffect(() => {
        checkOverflow();

        const handleResize = () => {
            checkOverflow();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [done]);

    useEffect(() => {
        if(done) checkOverflow();
    }, [done, isDescExpanded, areUsersExpanded]);

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
            const document = response.data.document;
            setDocData({
                title: document.title,
                description: document.description ?? <em>Nessuna descrizione</em>,
                file_type: response.data.file_type,
                category_id: document.category_id,
                users: document.users,
                uploadedAt: document.created_at,
                lastModified: document.updated_at
            });
            setDone(true);
        }).catch(error => {
            console.error('Error fetching document data:', error);
        });
    }, [params]);

    const handleDescExpand = () => {
        setIsDescExpanded(isDescExpanded => !isDescExpanded);
    }

    const handleUsersExpand = () => {
        setAreUsersExpanded(areUsersExpanded => !areUsersExpanded);
    }

    const renderUsers = () => {
        return docData.users.map((user, index) => {
            return (
                <ul className="doc-view-users-list-item" key={index}>
                    <p><span className="color-red">Nome utente: </span>{user.username}</p>
                    <p><span className="color-red">Email: </span>{user.email}</p>
                </ul>
            );
        });
    }

    return (
        !done ? <Loader /> :
        <div className="doc-view-page">
            <h1><span className="color-red">Visualizza</span> Documento</h1>
            <div className="doc-view-container">
                <div ref={mainInfoRef} className={`doc-view-main-info ${isDescExpanded ? 'expanded' : ''}`}>
                    <h2 className="color-red info-title bold">Titolo:</h2>
                    <h2>{docData.title}</h2>
                    <p className="color-red info-title">Categoria: </p>
                    <p>{categories[docData.category_id]}</p>
                    <p className="color-red info-title">Tipo file: </p>
                    <p><em>{docData.file_type}</em></p>
                    <p className="color-red info-title">Descrizione: </p>
                    <p ref={descriptionRef} className={`doc-description ${isDescOverflowing ? 'overflowing':''}`}>{docData.description}</p>
                    <button className="desc-show-more-btn" onClick={handleDescExpand}>{isDescExpanded ? 'Mostra meno' : 'Mostra di più'}</button>
                </div>
                <div ref={usersBoxRef} className={`doc-view-users ${areUsersExpanded ? 'expanded' : ''}`}>
                    <h2 className="doc-view-users-title">Utenti con <span className="color-red">accesso</span></h2>
                    <h3 className="doc-view-users-number">Numero di utenti: {docData.users.length}</h3>
                    <li ref={usersListRef} className={`doc-view-users-list ${areUsersOverflowing ? 'overflowing' : ''}`}>
                        {renderUsers()}
                    </li>
                    <button className="users-show-more-btn" onClick={handleUsersExpand}>{areUsersExpanded ? 'Mostra meno' : 'Mostra tutti'}</button>
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
            <Link to={`/documentation/management`}>Torna alla gestione</Link>
        </div>
    );
}
