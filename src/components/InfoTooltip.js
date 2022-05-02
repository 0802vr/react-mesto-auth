import React from 'react';
function InfoTooltip({name, isOpen, data, onClose}) {
    <section className={`popup popup_${name} ${isOpen && 'popup_opened'}`}>
        <div className="popup__container">
        <div className="popup__icon" style={{backgroundImage: `url(${data.image})`}}>
            <span className="popup__text">{data.text}</span>
            <button type="button" className="popup__close-container" onClick={onClose}></button>
            </div>  
        </div>
    </section>
}
export default InfoTooltip;