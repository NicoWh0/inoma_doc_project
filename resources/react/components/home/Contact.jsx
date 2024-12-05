import React from 'react';
import PhoneIcon from './icons/PhoneIcon';
import MailingIcon from './icons/MailingIcon';
import LocationIcon from './icons/LocationIcon';

export default function Contact() {
    return (
        <div className="contact">
            <h1><span className='color-red'>Contattaci</span> qui</h1>
            <p className="contact-description">Siamo disponibili per qualsiasi informazione o richiesta di supporto verso tutti i clienti</p>
            <ul className="contact-list">
                <li className="contact-item">
                    <PhoneIcon className="contact-icon" />
                    <p className="contact-text">
                        <a href="tel:+39 015 691799">+39 015 691799</a>
                    </p>
                </li>
                <li className="contact-item">
                    <MailingIcon className="contact-icon" />
                    <p className="contact-text">
                        <a href="mailto:info@inoma.it">info@inoma.it</a>
                    </p>
                </li>
                <li className="contact-item">
                    <LocationIcon className="contact-icon" />
                    <p className="contact-text">Via Cavour 106, Gaglianico, 13894, Biella, Italia</p>
                </li>
            </ul>
        </div>
)}
