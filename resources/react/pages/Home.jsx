import React from "react";
import SlideShow from "../components/home/SlideShow";
import InfoBox from "../components/home/InfoBox";
import EasyProfit from "../components/home/EasyProfit";
import Contact from "../components/home/Contact";

export default function Home() {
    return (
        <div className="home">
            <div className="home-banner">
                <SlideShow />
            </div>
            <div className="general-info-container">
                <h1><span className="color-red">Chi</span> Siamo</h1>
                <p>
                    Inoma srl si occupa di consulenza, progettazione e realizzazione di sistemi
                    informatici ed elettronici per sistemi ed automazioni industriali.
                    Inoltre offre la realizzazione di sistemi ad-hoc basati su soluzioni open-source.
                </p>
            </div>
            <div className="service-container">
                <h1><span className="color-red">Servizi</span> offerti</h1>
                <div className="info-boxes-container">
                    <InfoBox
                        altTitle="System Integration"
                        titleComponent={<span><span className="color-red">System</span> Integration</span>}
                        description={
                            <p>
                                Inoma si occupa dell'integrazione di sistemi.<br/><br/>
                                La nostra esperienza ci consente di progettare soluzioni personalizzate, garantendo un'interconnessione efficace tra le infrastrutture.
                                Grazie a un approccio modulare, affrontiamo ogni progetto valorizzando la complementarità delle tecnologie impiegate.<br/><br/>
                                Gli skill dei nostri competence center ci permettono di far dialogare tecnologie differenti con lo scopo di sfruttare le potenzialita di ognuna di esse.<br/>
                                Integriamo sistemi nell'ambito dell'information tecnology (IT) e nell'ambito dell'automazione industriale.
                            </p>
                        }
                        icon="/images/icon_sys_integration.png"
                    />
                    <InfoBox
                        altTitle="System Engineering"
                        titleComponent={<span><span className="color-red">System</span> Engineering</span>}
                        description={
                            <p>
                                Inoma si occupa della progettazione, minimizzazione e rinnovo dell'infrastruttura IT.<br/><br/> La stretta con importanti vendor come Fujitsu, Lenovo e Zyxel, garantiscono al ciente finale soluzioni ad alto impatto tecnologico.<br/><br/>
                                La seniority dei nostri consulenti in ambiente Open Source e Microsoft è garanzia di competenza ed affidabilità, sia nell'ambito di infrastrutture fisiche che virtuali.<br/>
                                I nostri consulenti vantano un'esperienza ventennale in merito a soluzioni enterprise che small business.
                            </p>
                        }
                        icon="/images/icon_sys_engineering.png"
                    />
                    <InfoBox
                        altTitle="Open Source"
                        titleComponent={<span><span className="color-red">Open Source</span> Development</span>}
                        description={
                            <p>
                                Inoma sviluppa sistemi Open Source.<br/><br/>
                                Il nostro team di sviluppatori si compone di figure Senior, in grado di progettare prodotti di qualità, stabili e supportate da un preciso e puntuale servizio di assistenza.<br/> Soluzioni modulari, scalabili ed aperte, permettono flessibilità d'uso ed evoluzioni innovative.<br/><br/>
                                Progettiamo e realizziamo applicazioni business-critical grazie all'ausilio di soluzioni High Availability, garanzia di continuità e affidabilità del servizio.<br/>
                                Non rivendiamo software di terze parti ma sviluppiamo software cucito su misura.
                            </p>
                        }
                        icon="/images/icon_open_source.png"
                    />
                </div>
            </div>
            <div className="product-container">
                <EasyProfit />
            </div>
            <div className="contact-container">
                <Contact />
            </div>
        </div>
    );
}
