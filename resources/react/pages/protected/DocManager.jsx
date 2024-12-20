import React, { useState, useEffect } from 'react';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import DocUpload from './DocUpload';
import DocCategories from './DocCategories';
import DocAdminManagement from './DocAdminManagement';

export default function DocManager() {
    const [subPage, setSubPage] = useState('management');
    const [categories, setCategories] = useState([]);

    const renderSubPage = () => {
        switch (subPage) {
            case 'upload':
                return <DocUpload categories={categories}/>;
            case 'categories':
                return <DocCategories categories={categories}/>;
            case 'management':
                return <DocAdminManagement />;
            default:
                return <DocUpload categories={categories}/>;
        }
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


    return (
        <div className="doc-manager-page">
            <div className="doc-manager-header">
                <div className="doc-manager-header-link doc-manager-upload-link">
                    <button
                        onClick={() => setSubPage('upload')}
                        className={subPage === 'upload' ? 'selected' : ''}
                    >
                        <span className="color-red">Carica</span> Documento
                    </button>
                </div>
                <div className="doc-manager-header-link doc-manager-category-manager-link">
                    <button
                        onClick={() => setSubPage('categories')}
                        className={subPage === 'categories' ? 'selected' : ''}
                    >
                        Gestisci <span className="color-red">Categorie</span>
                    </button>
                </div>
                <div className="doc-manager-header-link doc-manager-search-link">
                    <button
                        onClick={() => setSubPage('management')}
                        className={subPage === 'management' ? 'selected' : ''}
                    >
                            <span className="color-red">Gestisci</span> Documenti
                    </button>
                </div>
            </div>
            <div className="doc-manager-content">
                {renderSubPage()}
            </div>
        </div>
    );
}
