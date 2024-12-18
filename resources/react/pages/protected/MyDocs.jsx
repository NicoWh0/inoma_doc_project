import React, { useEffect, useRef, useState } from 'react';
import MyDocElement from '../../components/documentation/MyDocElement';

export default function MyDocs() {


    return (
        <div className="my-docs-page">
            <div className="my-docs-header">
                <div className="my-docs-title">
                    <h1>I Miei <span className="color-red">Documenti</span></h1>
                    <p>Benvenuto nella pagina relativa ai tuoi documenti</p>
                </div>
                <div className="my-docs-search">
                    <input type="text" placeholder="Cerca documenti"/>
                    <button>Cerca</button>
                </div>
            </div>
            <div className="my-docs-content">
                <ul className="my-docs-list">
                    <MyDocElement
                        title="Documento 1"
                        category="Categoria 1"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nunc nec mi fermentum ultricies. Integer
                        auctor, felis sit amet ultricies elementum, libero felis varius purus, nec ultricies libero metus nec libero."
                    />
                </ul>
            </div>
        </div>
    );
}
