import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function DocGridElement({ id, title, category, description, uploadedAt, lastModified }) {
    const [isDescOverflowing, setIsDescOverflowing] = useState(false);
    const descriptionRef = useRef(null);

    const checkOverflow = () => {
        const element = descriptionRef.current;
        if (element) {
            setIsDescOverflowing(element.scrollHeight > element.clientHeight);
        }
    };

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
        <>
            <p className="title">{title}</p>
            <p className="category">{category}</p>
            <p ref={descriptionRef} className={`description ${isDescOverflowing ? "overflowing" : ""}`}>{description}</p>
            <p className="date">{uploadedAt}</p>
            <p className="date">{lastModified}</p>
            <div className="actions-container">
                <Link to={`${id}/view`}>Visualizza</Link>
                <Link to={`${id}/edit`}>Modifica</Link>
            </div>
        </>
    );
}
