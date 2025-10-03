// Importa React e gli hook necessari
import React, { useState, useRef, useEffect } from 'react';

// Props del componente: funzione callback per selezionare la posizione
interface LocationInputProps {
  onLocationSelect: (coords: [number, number]) => void;
}

// Componente principale per input indirizzo e suggerimenti
const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect }) => {
  // Stato per l'indirizzo digitato dall'utente
  const [address, setAddress] = useState('');
  // Stato per eventuali errori da mostrare
  const [error, setError] = useState('');
  // Stato per mostrare loading durante la ricerca
  const [loading, setLoading] = useState(false);
  // Stato per i suggerimenti da mostrare nella lista
  const [suggestions, setSuggestions] = useState<any[]>([]);
  // Stato per mostrare/nascondere la lista suggerimenti
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Stato per la città dell'utente (default Milano)
  const [userCity, setUserCity] = useState<string>('Milano');
  // Stato per le coordinate dell'utente
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  // Ref per gestire il debounce della ricerca (timer)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref per evitare chiamate concorrenti e race condition
  const isFetchingRef = useRef(false);
  // Ref per tracciare la città usata nell'ultima fetch
  const lastCityRef = useRef(userCity);
  // Ref per gestire abort delle fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ricava la posizione dell'utente e la città tramite reverse geocoding
  useEffect(() => {
    // Se il browser supporta la geolocalizzazione
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        // Ottieni latitudine e longitudine dell'utente
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords([lat, lon]); // Salva coordinate utente
        try {
          // Reverse geocoding per ottenere la città
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
          const data = await resp.json();
          // Prendi la città, o fallback su Milano
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Milano';
          setUserCity(city); // Imposta città utente
        } catch {
          setUserCity('Milano'); // Fallback su Milano
        }
      }, () => setUserCity('Milano'));
    } else {
      setUserCity('Milano'); // Se geolocalizzazione non disponibile
    }
  }, []);


  // Static main streets of Milan for default suggestions
  const mainStreetsMilano = [
    { road: 'Via Torino', city: 'Milano' },
    { road: 'Via Dante', city: 'Milano' },
    { road: 'Via Brera', city: 'Milano' },
    { road: 'Corso Buenos Aires', city: 'Milano' },
    { road: 'Corso Magenta', city: 'Milano' },
    { road: 'Via Montenapoleone', city: 'Milano' },
    { road: 'Via Manzoni', city: 'Milano' },
    { road: 'Via della Moscova', city: 'Milano' },
    { road: 'Via Solferino', city: 'Milano' },
    { road: 'Via Vittor Pisani', city: 'Milano' },
    { road: 'Via Carducci', city: 'Milano' },
    { road: 'Via Washington', city: 'Milano' },
    { road: 'Via Ripamonti', city: 'Milano' },
    { road: 'Via Padova', city: 'Milano' },
    { road: 'Via Melchiorre Gioia', city: 'Milano' },
    { road: 'Via Farini', city: 'Milano' },
    { road: 'Via Cenisio', city: 'Milano' },
    { road: 'Via Lorenteggio', city: 'Milano' },
    { road: 'Via Foppa', city: 'Milano' },
    { road: 'Via Procaccini', city: 'Milano' }
  ];

  // Funzione che recupera i suggerimenti in base alla query
  const fetchSuggestions = async (query: string) => {
    // Annulla la fetch precedente se esiste
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isFetchingRef.current = true;
    // Se offline, mostra statiche
    if (!navigator.onLine) {
      const staticMatches = mainStreetsMilano
        .filter(s => (s.road || '').toLowerCase().includes((query || '').toLowerCase()))
        .map(s => ({ address: { road: s.road, city: s.city } }));
      setSuggestions(staticMatches.slice(0, 10));
      setShowSuggestions(true);
      isFetchingRef.current = false;
      return;
    }
    // Query: se vuota, cerca solo la città utente; se c'è testo, aggiungi città utente se non già presente
    let q = query.trim();
    if (!q) {
      // Se la query è vuota, cerca sia "centro" che "stazione" per la città
      q = `${userCity} centro|${userCity} stazione`;
    } else if (q.toLowerCase() === userCity.toLowerCase()) {
      // Se la query è solo la città, cerca sia centro che stazione
      q = `${userCity} centro|${userCity} stazione`;
    } else if (!q.toLowerCase().includes(userCity.toLowerCase())) {
      q = `${q} ${userCity}`;
    }
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(q)}`, { signal: controller.signal });
      let data = await resp.json();
      if (controller.signal.aborted) {
        isFetchingRef.current = false;
        return;
      }
      // Filtro: escludi risultati che sono solo info sulla città (es. solo "Milano"), mostra solo POI/indirizzi
      // Se la query è solo la città, aggiungi "Milano Centro" come primo risultato
      const isOnlyCity = q.trim().toLowerCase() === userCity.toLowerCase();
      let filtered = data.filter((item: any) => {
        const addr = item.address || {};
        const hasStreet = !!addr.road || !!addr.pedestrian || !!addr.square || !!addr.footway || !!addr.cycleway;
        const hasNumber = !!addr.house_number;
        // Escludi solo quelli che non hanno né via né numero civico
        return hasStreet || hasNumber;
      });
      // Se non ci sono risultati, mostra solo "Milano Centro" come fallback
      if (filtered.length === 0 && isOnlyCity) {
        filtered = [
          {
            display_name: `${userCity} Centro`,
            lat: data[0]?.lat || '',
            lon: data[0]?.lon || '',
            address: { city: userCity, road: '', house_number: '', cap: '' }
          }
        ];
      }
      // Se la query è solo la città, aggiungi "Milano Centro" come primo suggerimento
      if (isOnlyCity) {
        filtered = [
          {
            display_name: `${userCity} Centro`,
            lat: data[0]?.lat || '',
            lon: data[0]?.lon || '',
            address: { city: userCity, road: '', house_number: '', cap: '' }
          },
          ...filtered
        ];
      }
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
      isFetchingRef.current = false;
    } catch (err) {
      if (controller.signal.aborted) {
        isFetchingRef.current = false;
        return;
      }
      setSuggestions([]);
      setShowSuggestions(false);
      isFetchingRef.current = false;
    }
  };

  // Gestisce il cambiamento dell'input: aggiorna stato e lancia la ricerca suggerimenti con debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Nuovo valore digitato
    setAddress(value); // Aggiorna stato
    setError(''); // Reset errori
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cancella timer precedente
    // Debounce: attende 400ms prima di lanciare la ricerca
    timeoutRef.current = setTimeout(() => fetchSuggestions(value), 400);
  };

  // Quando l'input riceve il focus:
  // - se l'input è vuoto, mostra i suggerimenti (statici/offline se necessario)
  // - se ci sono già suggerimenti, li mostra
  const handleInputFocus = async () => {
    if (!address) {
      // Su focus input vuoto, mostra solo risultati della città utente (una sola fetch diretta)
      if (!navigator.onLine) {
        const staticCityMatches = mainStreetsMilano
          .filter(s => (s.city || '').toLowerCase() === (userCity || 'Milano').toLowerCase())
          .map(s => ({ address: { road: s.road, city: s.city } }));
        setSuggestions(staticCityMatches.slice(0, 10));
        setShowSuggestions(true);
      } else {
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(userCity)}`);
          const data = await resp.json();
          setSuggestions(data.slice(0, 10));
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Quando l'utente clicca su un suggerimento:
  // - aggiorna l'input con il nome selezionato
  // - nasconde la lista suggerimenti
  // - svuota i suggerimenti
  // - passa le coordinate selezionate al parent
  const handleSuggestionClick = (suggestion: any) => {
    setAddress(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
  };

  // Gestisce il submit del form:
  // - previene il comportamento di default
  // - resetta errori e mostra loading
  // - cerca le coordinate tramite Nominatim
  // - se trova risultati, passa le coordinate al parent
  // - altrimenti mostra errore
  // - nasconde loading e suggerimenti
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await resp.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        onLocationSelect([lat, lon]);
      } else {
        setError('Address not found.');
      }
    } catch (err) {
      setError('Error searching address.');
    }
    setLoading(false);
    setShowSuggestions(false);
  };

  return (
    <div style={{ margin: '1rem 0', textAlign: 'center', position: 'relative' }}>
      {/* Form di input indirizzo */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={address}
          onChange={handleInputChange}
          placeholder="Insert your address..."
          style={{ padding: 8, width: 400, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
          required
          onFocus={handleInputFocus}
        />
        <button type="submit" style={{ padding: 8, borderRadius: 6, background: '#EA6700', color: '#fff', border: 'none' }} disabled={loading}>
          {loading ? 'Searching...' : 'Insert your location'}
        </button>
      </form>
      {/* Lista suggerimenti: visibile solo se showSuggestions e ci sono risultati */}
      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 6,
          margin: 0,
          padding: 0,
          zIndex: 1000,
          listStyle: 'none',
          maxHeight: 250,
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {suggestions.map((s, i) => {
            const addr = s.address || {};
            // Compone la label: nome luogo (se presente) - via, numero civico, città, CAP
            const place = s.display_name && s.display_name.split(',')[0] !== addr.road ? s.display_name.split(',')[0] : '';
            const city = addr.city || addr.town || addr.village || addr.suburb || '';
            const cap = addr.postcode || '';
            const label = `${place ? place + ' - ' : ''}${addr.road || ''}${addr.house_number ? ', ' + addr.house_number : ''}${city ? ', ' + city : ''}${cap ? ', ' + cap : ''}`;
            // Ogni suggerimento è cliccabile e seleziona la posizione
            return (
              <li key={i} style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  onMouseDown={() => handleSuggestionClick(s)}>
                {label}
              </li>
            );
          })}
        </ul>
      )}
      {/* Messaggio di errore se presente */}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default LocationInput;

