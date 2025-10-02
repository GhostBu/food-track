import React, { useState } from 'react';
import './App.css';

function App() {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="App">
      <Header onMenuClick={() => setShowMenuDropdown((v) => !v)} showMenu={showMenuDropdown} onOrderClick={() => setShowOrder(true)} onLoginClick={() => setShowLogin(true)} />
      <main className="App-body">
        <HeroSection />
        <MenuSection />
      </main>
      {showOrder && <Overlay onClose={() => setShowOrder(false)}><OrderSection /></Overlay>}
      {showLogin && <Overlay onClose={() => setShowLogin(false)}><LoginSection /></Overlay>}
      <Footer />
    </div>
  );
}


// Header component
function Header({ onMenuClick, showMenu, onOrderClick, onLoginClick }: {
  onMenuClick: () => void;
  showMenu: boolean;
  onOrderClick: () => void;
  onLoginClick: () => void;
}) {
  return (
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
            <img src="/img/logo.svg" alt="Logo" className="Header-logo" />
          </div>
          <span className="Header-title">Food Track web site</span>
        </div>
        <div className="Header-actions" style={{ marginRight: 20, marginLeft: 'auto' }}>
          <button className="Section-toggle inverted" style={{ marginRight: 20 }} onClick={onOrderClick}>Order Now</button>
          <button className="Section-toggle inverted" onClick={onLoginClick}>Login</button>
        </div>
      </nav>
    </header>
  );
}

// Overlay component
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="Overlay">
      <div className="Overlay-bg" onClick={onClose}></div>
      <div className="Overlay-content">
        <button className="Overlay-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

// Hero section
function HeroSection() {
  return (
    <section className="Hero-section">
      <h2>Benvenuto nel servizio di food truck!</h2>
      <p>Ordina cibo da asporto o consegna direttamente dal camioncino più vicino.</p>
      <img src="/logo-foodtrack-monocromatico.svg" alt="Food Truck Logo" style={{ maxWidth: 200 }} />
    </section>
  );
}

// Menu section
function MenuSection() {
  // Immagini reali in public/prodotti
  const prodotti = [
    { nome: 'Carbonara', prezzo: 8, img: '/prodotti/carbonara.jpg' },
    { nome: 'Patatine Fritte', prezzo: 3, img: '/prodotti/patatine fritte.jpg' },
    { nome: 'Coca-Cola', prezzo: 2, img: '/prodotti/coca-cola.jpg' },
  ];
  return (
    <section className="Menu-section" id="menu">
      <h2>Menu</h2>
      <div className="Menu-list">
        {prodotti.map((p, i) => (
          <div className="Menu-item" key={i}>
            <img src={p.img} alt={p.nome} style={{ width: 80, height: 80, objectFit: 'cover' }} />
            <div><strong>{p.nome}</strong></div>
            <div>€ {p.prezzo.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Order section
function OrderSection() {
  return (
    <section className="Order-section" id="order">
      <h2>Ordina ora</h2>
      <p>Seleziona i prodotti dal menu e procedi con l’ordine!</p>
      {/* Qui andrà il form d’ordine */}
      <button>Inizia Ordine</button>
    </section>
  );
}

// Login section
function LoginSection() {
  return (
    <section className="Login-section" id="login">
      <h2>Accedi</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>Non hai un account? <a href="#">Registrati</a></p>
    </section>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="App-footer">
      <p>&copy; {new Date().getFullYear()} Food Truck Delivery. Tutti i diritti riservati.</p>
    </footer>
  );
}

export default App;
