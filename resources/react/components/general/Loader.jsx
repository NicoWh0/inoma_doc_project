import React from "react";
import  ClipLoader from 'react-spinners/ClipLoader';

export default function Loader() {
    return (
        <div className="loading">
            <ClipLoader color="#FF0000" loading={true} size={150} />
            <p>Caricamento ...</p>
        </div>
    );
}
