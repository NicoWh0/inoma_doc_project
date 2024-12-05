import React from "react";

export default function EasyProfit() {
    const handleClick = () => {
        window.open('/pdf/easy_profit.pdf', '_blank');
    }

    return (
        <div className="easy-profit" style={{backgroundImage: "url('images/easy_profit_bg.jpg')"}}>
            <h1 className="z-index-5">Il nostro <span className="color-red">Prodotto</span> di punta</h1>
            <img className="easy-profit-logo z-index-5" src="/images/easy_profit_logo.png" alt="Easy profit logo" />
            <p className="easy-profit-desc z-index-5">Il risparmio energetico intelligente</p>
            <button className="easy-profit-button z-index-5" onClick={handleClick}>Vedi brochure</button>
        </div>
    )
}
