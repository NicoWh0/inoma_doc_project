import React from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';


export default function PopupSuccess({ open, onClose, message }) {
    return (
        <Popup open={open} onClose={onClose} modal nested position={['center', 'center']}>
            {close => (
                <div className="modal popup-window popup-success">
                    <div className="close-btn-row">
                        <button className="close" onClick={close}>&times;</button>
                    </div>
                    <div className="header">
                        <h4>Successo</h4>
                    </div>
                    <div className="content">
                        {message}
                    </div>
                </div>
            )}
        </Popup>
    );
}
