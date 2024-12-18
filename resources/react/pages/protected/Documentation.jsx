import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import MyDocs from './MyDocs';
import DocManager from './DocManager';


//TODO: Implementare la pagina di documentazione
export default function Documentation() {
    const { user } = useContext(AuthContext);

    if(user.type === 0) {
        return <MyDocs />;
    }
    else return <DocManager />;
}
