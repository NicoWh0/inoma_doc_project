import React, { useState, useEffect, useCallback } from "react";
import { instance as axios } from '../axios/AxiosInterceptor';
import SelectCategory from "./SelectCategory";
import SelectUserSearch from "./SelectUserSearch";
import TinyLoader from "../general/TinyLoader";
import PopupSuccess from "../general/PopupSuccess";

import _ from 'lodash';

export default function DocUpload({categories}) {
    const [userOptions, setUserOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState({inProgress: true, success: false});
    const [searchFocus, setSearchFocus] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        file: null,
        users: []
    });

    const fetchUsers = useCallback(_.debounce((searchTerm) => {
        setSearching({inProgress: true, success: false});
        axios.get('/user/standard', {params: {search: searchTerm}})
            .then(response => {
                console.log(response.config.url);
                console.log('Users:', response.data);
                setUserOptions(response.data);
                setSearching({inProgress: false, success: true});
            })
            .catch(error => {
                if(error.response.status === 404) {
                    console.log('No users found');
                    setUserOptions([]);
                    setSearching({inProgress: false, success: false});
                }
                else console.error('Error fetching users:', error);
            });
    }, 1000), []);


    useEffect(() => {
        console.log('Auto fetching users');
        if(searchTerm.length > 0) fetchUsers(searchTerm);
        else fetchUsers();

    }, [searchTerm, fetchUsers]);


    const handleOnChangeSearchUser = (e) => {
        if(e.target.value.length > 320) return;
        setSearchTerm(e.target.value);
    }

    const handleChangeForm = (e) => {
        const {name, value} = e.target;
        if(name === 'title' && value.length > 32) return;
        if(name === 'description' && value.length > 512) return;
        setFormData(prevformData => (
            {...prevformData, [name]: name === 'file' ? e.target.files[0] : value}
        ));
    }

    const handleSelectChangeUser = (selectedUsers) => {
        const userOptions = selectedUsers.map(user => user.value);
        setFormData(prevformData => (
            {...prevformData, users: userOptions}
        ));
    }

    const handleSelectChangeCategory = (selectedCategory) => {
        setFormData(prevformData => (
            {...prevformData, category: selectedCategory.value}
        ));
    }

    const checkIfFormIsValid = () => {
        if(formData.title.length < 4 || formData.title.length > 32) return false;
        if(formData.category === '') return false;
        if(formData.users.length === 0) return false;
        if(formData.file === null) return false;
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Document upload form submitted');
        console.log(formData);
        axios.post('/documentation', formData).then(response => {
            console.log('Document upload response:', response.data);
            setUploadSuccess(true);
        }).catch(error => {
            console.error('Document upload error:', error);
        });
    }

    const renderCategories = () => {
        const categoriesComponents = [];
        for(let id in categories) {
            categoriesComponents.push(
                {
                    value: id,
                    category: categories[id],
                    label: (
                        <div className="doc-upload-category">
                            <span>{categories[id]}</span>
                        </div>
                    )
                }
            );
        }
        return categoriesComponents;
    }

    const renderUsers = () => {
        const usersComponents = [];
        for(let user of userOptions) {
            usersComponents.push(
                {
                    value: user.id,
                    username: user.username,
                    label: (
                       <div className="doc-user-select-item">
                            <div className="doc-user-select-item-inline">
                                <span className="color-red">nome utente:</span> {user.username}
                            </div>
                            <div className="doc-user-select-item-inline">
                                <span className="color-red">email:</span> {user.email}
                            </div>
                       </div>
                    )
                });
        }
        return usersComponents;
    }


    return (
        <>
            <PopupSuccess
                open={uploadSuccess}
                onClose={() => setUploadSuccess(false)} //TODO: Redirect to document page
                message="Documento caricato con successo!"
            />
            <div className="doc-upload-title">
                <h1><span className="color-red">Carica</span> Documento</h1>
            </div>
            <div className="doc-upload-form-container">
                <form className="doc-upload-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titolo<span className="color-red">*</span></label>
                        <input
                            onChange={handleChangeForm}
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Inserire il titolo del documento (4-32 caratteri)"
                            value={formData.title}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Categoria<span className="color-red">*</span></label>
                        <SelectCategory
                            id="category"
                            renderCategories={renderCategories}
                            handleSelectChange={handleSelectChangeCategory}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descrizione</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Inserire una descrizione del documento (opzionale)"
                            value={formData.description}
                            onChange={handleChangeForm}
                        />
                        <div className={`remaining-chars ${formData.description.length > 400 ? 'visible' : ''}`}>
                            {formData.description.length}/512
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="users">Associa Utenti<span className="color-red">*</span></label>
                        <div className="doc-user-form">
                            <div className={`doc-user-search ${searchFocus ? 'focused' : ''}`}>
                                <input
                                    className="doc-user-search-input"
                                    type="text"
                                    placeholder="Cerca per username o email"
                                    value={searchTerm}
                                    onChange={handleOnChangeSearchUser}
                                    onFocus={() => setSearchFocus(true)}
                                    onBlur={() => setSearchFocus(false)}
                                />
                                <div className="doc-user-search-icon">
                                    {   searching.inProgress ?
                                            <TinyLoader />
                                        :
                                            searching.success ?
                                                <img src="/images/checkmark.png" alt="ok" title="Ricerca completata" />
                                            :
                                                <img src="/images/red-x.png" alt="ko" title="Nessun utente trovato" />
                                    }
                                </div>
                            </div>
                            <SelectUserSearch
                                id="users"
                                renderUsers={renderUsers}
                                handleSelectChange={handleSelectChangeUser}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">File<span className="color-red">*</span></label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            required
                            onChange={handleChangeForm}
                            hidden
                        />
                        <label htmlFor="file" className="doc-upload-file-label">
                            <span className="doc-upload-file-label-text">Scegli file</span>
                            <span className="doc-upload-file-name">{formData.file ? formData.file.name : 'Nessun file selezionato'}</span>
                        </label>
                    </div>
                    <div className="form-group">
                        <div className="doc-upload-button-container">
                            <button type="submit" className="doc-upload-button" disabled={!checkIfFormIsValid()}>Carica</button>
                        </div>
                    </div>
                </form>
            </div>
        </>

    );
}
