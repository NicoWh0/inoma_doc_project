import React, { useState, useEffect, useCallback } from "react";
import { instance as axios } from '../axios/AxiosInterceptor';
import Select, { components } from 'react-select';
import _, { parseInt } from 'lodash';

const MultiValue = props => (
    <components.MultiValue {...props}>
        {props.data.username}
    </components.MultiValue>
);



export default function DocUpload({categories}) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        file: '',
        users: []
    });

    const fetchUsers = useCallback(_.debounce((searchTerm) => {
        axios.get('/user/standard', {params: {search: searchTerm}})
            .then(response => {
                console.log(response.config.url);
                console.log('Users:', response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, 1000), []);


    useEffect(() => {
        console.log('Auto fetching users');
        if(searchTerm.length > 0) fetchUsers(searchTerm);
        else fetchUsers();

    }, [searchTerm, fetchUsers]);


    const handleOnChangeSearchUser = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleChangeForm = (e) => {
        const {name, value} = e.target;
        setFormData(prevformData => (
            {...prevformData, [name]: name === 'file' ? e.target.files[0] : value}
        ));
    }

    const handleSelectChange = (selectedUsers) => {
        const users = selectedUsers.map(user => user.value);
        setFormData(prevformData => (
            {...prevformData, users: users}
        ));
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Document upload form submitted');
        console.log(formData);
        axios.post('/documentation', formData).then(response => {
            console.log('Document upload response:', response.data);
        }).catch(error => {
            console.error('Document upload error:', error);
        });
    }

    const renderCategories = () => {
        const categoriesComponents = [];
        for(let id in categories) {
            categoriesComponents.push(
                <option key={id} value={id}>{categories[id]}</option>
            );
        }
        return categoriesComponents;
    }

    const renderUsers = () => {
        const usersComponents = [];
        for(let user of users) {
            usersComponents.push(
                {
                    value: user.id,
                    username: user.username,
                    label: (
                       <div className="doc-user-select-item">
                            <span>nome utente: {user.username}</span>
                            <span>email: {user.email}</span>
                       </div>
                    )
                });
        }
        return usersComponents;
    }


    return (
        <>
            <div className="doc-upload-title">
                <h1><span className="color-red">Carica</span> Documento</h1>
            </div>
            <div className="doc-upload-form-container">
                <form className="doc-upload-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titolo</label>
                        <input
                            onChange={handleChangeForm}
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Inserire il titolo del documento"
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Categoria</label>
                        <select
                            id="category"
                            name="category"
                            required
                            onChange={handleChangeForm}
                        >
                            <option value="">Seleziona una categoria</option>
                            {renderCategories()}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descrizione</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Inserire una descrizione del documento (opzionale)"
                            onChange={handleChangeForm}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">File</label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            required
                            onChange={handleChangeForm}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="users">Associa Utenti</label>
                        <div className="doc-user-form">
                            <input
                                type="text"
                                placeholder="Filtra per username o email"
                                onChange={handleOnChangeSearchUser}
                            />
                            <Select
                                classNames={{
                                    container: () => 'doc-user-select',
                                }}
                                components={{ MultiValue }}
                                placeholder="Seleziona utenti"
                                options={renderUsers()}
                                onChange={handleSelectChange}
                                isMulti
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Carica</button>
                    </div>
                </form>
            </div>
        </>

    );
}
