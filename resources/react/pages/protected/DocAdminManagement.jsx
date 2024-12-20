import React, { useEffect, useState, useCallback, useRef } from 'react';
import MyDocElement from '../../components/documentation/MyDocElement';
import { instance as axios } from '../../components/axios/AxiosInterceptor';
import SelectCategory from '../../components/documentation/SelectCategory';
import _ from 'lodash';
import Loader from '../../components/general/Loader';

export default function DocAdminManagement() {

    return (
        <div className="doc-admin-management">
            <div className="doc-admin-management-header">
                <h1><span className="color-red">Gestisci</span> Documenti</h1>
                <p>Qui puoi gestire i documenti da te caricati</p>
                <div className="doc-admin-management-search">
                    <input type="text" placeholder="Cerca documento..."/>
                    <button>Cerca</button>
                </div>
            </div>
            <div className="doc-admin-management-documents-grid">
                <p className="color-red bold">Titolo</p>
                <p className="bold">Categoria</p>
                <p className="bold">Descrizione</p>
                <p className="bold">Caricato il</p>
                <p className="bold">Ultima modifica</p>
                <p className="bold">Azioni</p>

                <DocGridElement
                    title="Documento 1"
                    category="Categoria 1"
                    description="Descrizione particolarmente lunga per testare l'overflow del testo. Devo aggiungere ancora qualche carattere."
                    uploadedAt="Caricato il 1"
                    lastModified="Ultima modifica 1"
                />
                <DocGridElement
                    title="Documento 2"
                    category="Categoria 2"
                    description="Descrizione 2"
                    uploadedAt="Caricato il 2"
                    lastModified="Ultima modifica 2"
                />
                <DocGridElement
                    title="Documento 3"
                    category="Categoria 3"
                    description="Descrizione 3"
                    uploadedAt="Caricato il 3"
                    lastModified="Ultima modifica 3"
                />

            </div>
        </div>
    );
}
