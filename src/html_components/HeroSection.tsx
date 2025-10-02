import React from 'react';

const HeroSection: React.FC = () => (
    <section className="Hero-section">
        <h2>Benvenuto nel servizio di food truck!</h2>
        <p>Ordina cibo da asporto o consegna direttamente dal camioncino più vicino.</p>
        <img src="/logo-foodtrack-monocromatico.svg" alt="Food Truck Logo" style={{ maxWidth: 200 }} />
    </section>
);

export default HeroSection;
