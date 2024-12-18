import React, { useState, useRef, useEffect } from 'react';

export default function MyDocElement({title, category, description}) {
    const [expanded, setExpanded] = useState(false);
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
        <li className={`my-docs-list-item ${expanded ? 'expanded' : ''}`}>
            <div className="my-docs-list-item-section">
                <h3>{title}</h3>
            </div>
            <div className="my-docs-list-item-section">
                <p>{category}</p>
            </div>
            <div className={`my-docs-list-item-section ${isDescOverflowing ? 'overflowing' : ''}`}>
                <p ref={descriptionRef} className="description">{description}</p>
            </div>
            <div className="my-docs-list-item-section">
                <button className="my-docs-download-button">Scarica</button>
            </div>
            {isDescOverflowing &&
                <div className="my-docs-show-more">
                    <button
                        className="my-docs-show-more-button"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Mostra meno' : 'Mostra di più'}
                    </button>
                </div>
            }
         </li>
    )
}
