import React, { useEffect, useState, useCallback } from 'react';
import MyDocElement from '../../components/documentation/MyDocElement';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import SelectCategory from '../../components/documentation/SelectCategory';
import _, { set } from 'lodash';
import Loader from '../../components/general/Loader';

export default function MyDocs() {

    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchForm, setSearchForm] = useState({
        search: '',
        category: null
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searching, setSearching] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const categories = await axios.get('api/categories');
            console.log('Categories:', categories);
            setCategories(categories.data);
            const docs = await axios.get('/documentation/personal');
            console.log('Docs:', docs);
            handleDocumentsResponse(docs, categories.data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(categories.length === 0) return;
        console.log('Auto fetching documents');
        fetchDocuments(searchForm.search, searchForm.category, categories);
    }, [searchForm]);

    const fetchDocuments = useCallback(_.debounce((searchTerm, categoryType, categories) => {
        setDocuments([]);
        setSearching(true);
        axios.get('/documentation/personal', {params: {search: searchTerm, category: categoryType}})
            .then(response => {
                console.log(response.config.url);
                console.log('Documents:', response.data);
                handleDocumentsResponse(response, categories);
            })
            .catch(error => {
                if(error.response.status === 404) {
                    console.log('No doc found');
                    setSearching(false);
                }
                else console.error('Error fetching docs:', error);
            });
    }, 1000), []);

    const handleDocumentsResponse = (response, categories) => {
        console.log('Categories:', categories);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const newDocs = [];
        response.data.forEach(doc => {
            newDocs.push({
                id: doc.id,
                path: doc.file_path,
                title: doc.title,
                category: categories[doc.category_id],
                description: doc.description,
                lastModified: new Date(doc.updated_at).toLocaleString("it-IT", options)
            });
        });
        console.log('New docs:', newDocs);
        setDocuments(newDocs);
        setSearching(false);
    }

    const handleSearchChange = (e) => {
        setSearchForm(prev => (
            {...prev, search: e.target.value}
        ));
    }

    const handleSelectChangeCategory = (selectedCategory) => {
        setSearchForm(prev => (
            {...prev, category: selectedCategory.value}
        ));
    }


    const renderCategories = () => {
        const categoriesComponents = [
            {
                value: null,
                category: <span style={{color: 'hsl(0, 0%, 50%)'}}>Seleziona categoria</span>,
                label: (
                    <div>
                        <span style={{color: 'hsl(0, 0%, 50%)'}}>Seleziona categoria</span>
                    </div>
                )
            }
        ];
        for(let id in categories) {
            categoriesComponents.push(
                {
                    value: id,
                    category: categories[id],
                    label: (
                        <div>
                            <span>{categories[id]}</span>
                        </div>
                    )
                }
            );
        }
        return categoriesComponents;
    }


    const renderDocuments = () => {
        if(documents.length === 0 && searching) return <Loader />;
        else if(documents.length === 0) return <p>Nessun documento trovato</p>;
        return documents.map((doc, index) => {
            return (
                <MyDocElement
                    key={index}
                    id={doc.id}
                    path={doc.path}
                    title={doc.title}
                    category={doc.category}
                    description={doc.description}
                    lastModified={doc.lastModified}
                />
            );
        });
    }


    return (
        <div className="my-docs-page">
            <div className="my-docs-header">
                <div className="my-docs-title">
                    <h1>I Miei <span className="color-red">Documenti</span></h1>
                    <p>Benvenuto nella pagina relativa ai tuoi documenti</p>
                </div>
                <div className="my-docs-search">
                    <div className={`my-docs-search-input-container ${isSearchFocused ? 'focused' : ''}`}>
                        <input
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="my-docs-search-input"
                            type="text"
                            name="search"
                            placeholder="Cerca documenti"
                            value={searchForm.search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <SelectCategory
                        height={'41px'}
                        width={'250px'}
                        handleSelectChange={handleSelectChangeCategory}
                        renderCategories={renderCategories}
                    />
                </div>
            </div>
            <div className="my-docs-content">
                <ul className="my-docs-list">
                    {renderDocuments()}
                </ul>
            </div>
        </div>
    );
}
