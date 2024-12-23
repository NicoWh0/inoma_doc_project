import React from 'react';
import _ from 'lodash';
import DocGrid from '../../components/documentation/DocGrid';
import DocGridTitles from '../../components/documentation/DocGridTitles';
import DocGridElement from '../../components/documentation/DocGridElement';
import DocSearchPage from './DocSearchPage';


export default function DocAdminManagement() {

    const renderDocuments = (documents, searching) => {
        if(documents.length === 0 && searching) return null;
        else if(documents.length === 0) return <p>Nessun documento trovato</p>;
        let tableComponents = [];
        for(let doc of documents) {
            tableComponents.push(
                <DocGridElement
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    category={doc.category}
                    description={doc.description}
                    uploadedAt={doc.uploadedAt}
                    lastModified={doc.lastModified}
                />
            );
        }
        return (
            <DocGrid
                docGridTitles={
                    <DocGridTitles/>
                }
                docGridElements={tableComponents}
            />
        )
    }

    const renderTitle = () => {
        return <h1><span className="color-red">Gestisci</span> Documenti</h1>;
    }

    const renderSubTitle = () => {
        return <p>Qui puoi gestire i documenti da te caricati</p>;
    }

    return (
        <DocSearchPage
            titlePage={renderTitle()}
            subtitlePage={renderSubTitle()}
            documentsContainerClass="doc-admin-management-documents-grid-container"
            renderDocuments={renderDocuments}
            endpoint="documentation/management/docs"
        />
    );
}
