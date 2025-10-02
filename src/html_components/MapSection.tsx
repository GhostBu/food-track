

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix per icone marker in React/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Dati statici dei camioncini
const trucks = [
    { id: 1, name: 'Camioncino Centrale', lat: 45.4642, lng: 9.19 },
    { id: 2, name: 'Camioncino Navigli', lat: 45.4500, lng: 9.1700 },
    { id: 3, name: 'Camioncino Bicocca', lat: 45.5165, lng: 9.2130 },
    { id: 4, name: 'Camioncino San Siro', lat: 45.4781, lng: 9.1240 },
];

function LocateAndCenter({ setCenter }: { setCenter: (c: [number, number]) => void }) {
    const map = useMap();
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setCenter(coords);
                    map.setView(coords, 13);
                },
                () => { },
                { enableHighAccuracy: true }
            );
        }
    }, [map, setCenter]);
    return null;
}

const MapSection: React.FC = () => {
    const [center, setCenter] = useState<[number, number]>([45.4642, 9.19]); // Milano centro

    return (
        <section className="Map-section" style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2>Mappa dei camioncini</h2>
            <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', height: 350 }}>
                <MapContainer center={center} zoom={13} style={{ width: '100%', height: 350, borderRadius: 12 }} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocateAndCenter setCenter={setCenter} />
                    {trucks.map(t => (
                        <Marker key={t.id} position={[t.lat, t.lng]}>
                            <Popup>
                                <b>{t.name}</b><br />
                                <a href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`} target="_blank" rel="noopener noreferrer">Apri su Google Maps</a>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </section>
    );
};

export default MapSection;
