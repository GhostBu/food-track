import React from 'react';

interface HeaderProps {
    onMenuClick: () => void;
    showMenu: boolean;
    onOrderClick: () => void;
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenu, onOrderClick, onLoginClick }) => (
    <header className="App-header">
        <nav className="Header-nav">
            <div className="Menu-dropdown-container" style={{ marginLeft: 0 }}>
                <button className="Menu-toggle" onClick={onMenuClick}>
                    Menu
                </button>
                {showMenu && (
                    <div className="Dropdown-menu">
                        <a href="#merch">Merchandising</a>
                        <a href="#subs">Subscriptions</a>
                    </div>
                )}
            </div>
            <div className="Header-logo-title" style={{ margin: '0 auto' }}>
                <div className="Header-logo-box">
                    <img src="/img/logo-moving-wheels.svg" alt="Logo" className="Header-logo" />
                </div>
                <span className="Header-title" style={{ color: '#111' }}>Food Track web site</span>
            </div>
            <div className="Header-actions" style={{ marginRight: 20, marginLeft: 'auto' }}>
                <button className="Section-toggle inverted" style={{ marginRight: 20 }} onClick={onOrderClick}>Order Now</button>
                <button className="Section-toggle inverted" onClick={onLoginClick}>Login</button>
            </div>
        </nav>
    </header>
);

export default Header;
