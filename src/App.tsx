
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './html_components/Header';
import HeroSection from './html_components/HeroSection';
import MenuSection from './html_components/MenuSection';
import MapSection from './html_components/MapSection';
import OrderSection from './html_components/OrderSection';
import LoginSection from './html_components/LoginSection';
import Footer from './html_components/Footer';
import Overlay from './html_components/Overlay';

function App() {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // State to pass user position to MapSection
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="App">
      <Header onMenuClick={() => setShowMenuDropdown((v) => !v)} showMenu={showMenuDropdown} onOrderClick={() => setShowOrder(true)} onLoginClick={() => setShowLogin(true)} />
      <main className="App-body">
        <HeroSection />
        <MapSection userPosition={userPosition} />
        <MenuSection />
      </main>
      {showOrder && <Overlay onClose={() => setShowOrder(false)}><OrderSection /></Overlay>}
      {showLogin && <Overlay onClose={() => setShowLogin(false)}><LoginSection /></Overlay>}
      <Footer />
    </div>
  );
}

export default App;


