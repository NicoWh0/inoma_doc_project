import React from "react";
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export default function SlideShow() {
    const slideImages = [
        '/images/information_technology.jpg',
        '/images/automation.jpg',
        '/images/management.jpg',
        '/images/telecommunications.jpg'
    ];

    const properties = {
        duration: 5000,
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: false
    }

    return (
        <div className="react-slide-container">
            <Fade
                {...properties}
            >
                <div className="each-slide">
                    <div className="image-container">
                        <img src={slideImages[0]} alt="Information Technologies" />
                    </div>
                    <div className="semi-trasparent-bg"/>
                    <h3 className="title"><span className="color-red">Information</span> Technologies</h3>
                    <p className="description">Soluzioni adeguate per le aziende</p>
                </div>
                <div className="each-slide">
                    <div className="image-container">
                        <img src={slideImages[1]} alt="Automazione industriale" />
                    </div>
                    <div className="semi-trasparent-bg"/>
                    <h3 className="title"><span className="color-red">Automazione</span> industriale</h3>
                    <p className="description">Ottimizzazione dei processi produttivi</p>
                </div>
                <div className="each-slide">
                    <div className="image-container">
                        <img src={slideImages[2]} alt="Gestionali e logistica" />
                    </div>
                    <div className="semi-trasparent-bg"/>
                    <h3 className="title"><span className="color-red">Gestionali</span> e logistica</h3>
                    <p className="description">Soluzioni per efficienza aziendale</p>
                </div>
                <div className="each-slide">
                    <div className="image-container">
                        <img src={slideImages[3]} alt="Telecomunicazioni e Media" />
                    </div>
                    <div className="semi-trasparent-bg"/>
                    <h3 className="title"><span className="color-red">Telecomunicazioni</span> e Media</h3>
                    <p className="description">Connessione e contenuti digitali</p>
                </div>
            </Fade>
        </div>
    );
}
