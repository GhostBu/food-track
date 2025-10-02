import React from 'react';

const OrderSection: React.FC = () => (
    <section className="Order-section" id="order">
        <h2>Ordina ora</h2>
        <p>Seleziona i prodotti dal menu e procedi con l’ordine!</p>
        {/* Qui andrà il form d’ordine */}
        <button>Inizia Ordine</button>
    </section>
);

export default OrderSection;
