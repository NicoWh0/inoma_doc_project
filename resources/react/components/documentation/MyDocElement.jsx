import React, { useState, useRef, useEffect } from 'react';
import { instance as axios } from '../axios/AxiosInterceptor';

export default function MyDocElement({id, path, title, category, description, lastModified}) {
    const [expanded, setExpanded] = useState(false);
    const [isDescOverflowing, setIsDescOverflowing] = useState(false);
    const descriptionRef = useRef(null);


    const checkOverflow = () => {
        const element = descriptionRef.current;
        if (element) {
            setIsDescOverflowing(element.scrollHeight > element.clientHeight);
        }
    };

    const handleDownload = () => {
        console.log('Download: ', title);
        axios.get(`/documentation/download/${id}`, {responseType: 'blob'}).then(response => {
            console.log('Downloaded document:', response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log('URL:', url);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', path);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }).catch(error => {
            console.error('Error downloading document:', error);
        });
    }

    useEffect(() => {
        checkOverflow();

        const handleResize = () => {
            checkOverflow();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <li className="my-docs-list-item">
            <div className="my-docs-item-header">
                <div className="my-docs-item-header-section">
                    <p className="color-red">Titolo</p>
                </div>
                <div className="my-docs-item-header-section">
                    <p>Categoria</p>
                </div>
                <div className="my-docs-item-header-section">
                    <p>Descrizione</p>
                </div>
                <div className="my-docs-item-header-section">
                    <p>Download</p>
                </div>
            </div>
            <div className={`my-docs-list-item-content ${expanded ? 'expanded' : ''}`}>
                <div className="my-docs-list-item-section">
                    <h4>{title}</h4>
                </div>
                <div className="my-docs-list-item-section">
                    <p>{category}</p>
                </div>
                <div className={`my-docs-list-item-section ${isDescOverflowing ? 'overflowing' : ''}`}>
                    <p ref={descriptionRef} className="description">{description ?? <em>Nessuna descrizione</em>}</p>
                </div>
                <div className="my-docs-list-item-section">
                    <button onClick={handleDownload} className="my-docs-download-button">Scarica</button>
                </div>
            </div>
            <div className="my-docs-list-item-last-modified">
                <p>Ultima modifica: {lastModified}</p>
            </div>
            {isDescOverflowing &&
                <div className="my-docs-show-more">
                    <button className="my-docs-show-more-button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Mostra meno' : 'Mostra di più'}</button>
                </div>
            }
        </li>
    )
}
