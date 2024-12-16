import React from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

export default function PopupFailure({ open, onClose, message }) {
    return (
        <Popup open={open} onClose={onClose} modal nested position={['center', 'center']}>
            {close => (
                <div className="modal popup-window popup-failure">
                    <div className="close-btn-row">
                        <button className="close" onClick={close}>&times;</button>
                    </div>
                    <div className="header">
                        <h4>Errore</h4>
                    </div>
                    <div className="content">
                        {message}
                    </div>
                </div>
            )}
        </Popup>
    );
}
