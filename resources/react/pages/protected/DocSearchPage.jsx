import React, { useEffect, useState, useCallback, useRef } from 'react';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import SelectCategory from '../../components/documentation/SelectCategory';
import _ from 'lodash';
import Loader from '../../components/general/Loader';

export default function DocSearchPage({titlePage, subtitlePage, renderDocuments}) {

    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchForm, setSearchForm] = useState({
        search: '',
        category: null
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searching, setSearching] = useState(true);
    const [page, setPage] = useState(1);
    const [endDocuments, setEndDocuments] = useState(false);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const categories = await axios.get('api/categories');
            setCategories(categories.data);
            try {
                const docs = await axios.get('/documentation/personal');
                console.log('First docs:', docs);
                handleDocumentsResponse(docs, categories.data);
            }
            catch(error) {
                if(error.response.status === 404) {
                    console.log('No doc found');
                    setSearching(false);
                }
                else console.error('Error fetching docs:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(categories.length === 0) return;
        console.log('Auto fetching documents');
        fetchDocuments(searchForm.search, searchForm.category, categories);
    }, [searchForm]);


    useEffect(() => {
        if(endDocuments) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 1.0 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (page > 1 && !endDocuments) {
            fetchMoreDocuments(searchForm.search, searchForm.category, categories, page);
        }
    }, [page]);

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

    const fetchMoreDocuments = (searchTerm, categoryType, categories, page) => {
        axios.get('/documentation/personal', {params: {search: searchTerm, category: categoryType, page: page}})
            .then(response => {
                console.log(response.config.url);
                handleDocumentsResponse(response, categories, true);
            })
            .catch(error => {
                if(error.response.status === 404) {
                    console.log('No doc found');
                    setEndDocuments(true);
                }
                else console.error('Error fetching docs:', error);
            });
    }

    const handleDocumentsResponse = (response, categories, append = false) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const newDocs = append ? [...documents] : [];
        response.data.data.forEach(doc => {
            newDocs.push({
                id: doc.id,
                path: doc.file_path,
                title: doc.title,
                category: categories[doc.category_id],
                description: doc.description,
                lastModified: new Date(doc.updated_at).toLocaleString("it-IT", options)
            });
        });
        setDocuments(newDocs);
        setSearching(false);
    }

    const handleSearchChange = (e) => {
        setPage(1);
        setEndDocuments(false);
        setSearchForm(prev => (
            {...prev, search: e.target.value}
        ));
    }

    const handleSelectChangeCategory = (selectedCategory) => {
        setPage(1);
        setEndDocuments(false);
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

    return (
        <div className="docs-page">
            <div className="docs-header">
                <div className="docs-title">
                    {titlePage}
                    {subtitlePage ?? ''}
                </div>
                <div className="docs-search">
                    <div className={`docs-search-input-container ${isSearchFocused ? 'focused' : ''}`}>
                        <input
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="docs-search-input"
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
            <div className="docs-content">
                {renderDocuments()}
                {searching && <Loader />}
                <div ref={loadMoreRef} style={{ height: '20px' }}></div>
            </div>
        </div>
    );
}
