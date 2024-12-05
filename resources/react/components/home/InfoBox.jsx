import React from "react";


export default function InfoBox({ altTitle, titleComponent, description, icon }) {
    return (
        <div className="info-box">
        <div className="info-box-title-icon-container">
            <h2>{titleComponent}</h2>
            <div className="info-icon-container">
                <img className="info-icon" src={icon} alt={altTitle} />
            </div>
        </div>
        <div className="info-description">
            {description}
        </div>
    </div>
    );
}
