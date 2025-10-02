import React from 'react';

const prodotti = [
    { nome: 'Carbonara', prezzo: 8, img: '/prodotti/carbonara.jpg' },
    { nome: 'Patatine Fritte', prezzo: 3, img: '/prodotti/patatine fritte.jpg' },
    { nome: 'Coca-Cola', prezzo: 2, img: '/prodotti/coca-cola.jpg' },
];

const MenuSection: React.FC = () => (
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

export default MenuSection;
