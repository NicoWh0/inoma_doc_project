import React from 'react';
import MyDocElement from '../../components/documentation/MyDocElement';
import _ from 'lodash';
import DocSearchPage from './DocSearchPage';

export default function MyDocs() {

    const renderTitle = () => {
        return <h1>I Miei <span className="color-red">Documenti</span></h1>;
    }

    const renderSubTitle = () => {
        return <p>Benvenuto nella pagina relativa ai tuoi documenti</p>;
    }

    const renderDocuments = (documents, searching) => {
        if(documents.length === 0 && searching) return null;
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
        <DocSearchPage
            titlePage={renderTitle()}
            subtitlePage={renderSubTitle()}
            documentsContainerClass="my-docs-list"
            renderDocuments={renderDocuments}
            endpoint="documentation/personal/docs"
        />
    );
}
