import React from 'react';

interface OverlayProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => (
    <div className="Overlay">
        <div className="Overlay-bg" onClick={onClose}></div>
        <div className="Overlay-content">
            <button className="Overlay-close" onClick={onClose}>×</button>
            {children}
        </div>
    </div>
);

export default Overlay;
