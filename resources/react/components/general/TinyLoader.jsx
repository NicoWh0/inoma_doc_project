import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function TinyLoader() {
    return (
        <ClipLoader color="grey" loading={true} size={20} />
    );
}
