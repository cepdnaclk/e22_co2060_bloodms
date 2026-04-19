import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { searchHospitalsByName, searchHospitalsInArea } from '../../utils/overpassApi';
import { Search, MapPin, Loader, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './HospitalMapPicker.css';

/* ── Fix Leaflet default marker icon (broken in bundlers) ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/* ── Helper: fly to a position ── */
const FlyToPosition = ({ position, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom || 14, { duration: 1.2 });
        }
    }, [position, zoom, map]);
    return null;
};

/**
 * HospitalMapPicker — Nominatim Live Search
 *
 * User types → Nominatim finds hospitals → suggestions dropdown
 * → click to select → map zooms to hospital
 *
 * Example: type "emb" → suggests "Embilipitiya Base Hospital"
 */
const HospitalMapPicker = ({
    districtName,
    districtCenter,
    countryCenter = [7.8731, 80.7718],
    countryZoom = 8,
    selectedHospital,
    onSelectHospital,
    disabled = false,
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [allMarkers, setAllMarkers] = useState([]);            // markers shown on map
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [loadingArea, setLoadingArea] = useState(false);
    const [error, setError] = useState('');
    const [flyTo, setFlyTo] = useState(null);
    const [flyZoom, setFlyZoom] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceRef = useRef(null);

    /* ────────────────────────────────────────────────────────
       AUTO-LOAD: Fetch all area hospitals when district changes
       (shows markers on map even before user types)
       ──────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!districtCenter) {
            setAllMarkers([]);
            return;
        }

        let cancelled = false;
        setLoadingArea(true);

        searchHospitalsInArea(districtCenter, 35).then((results) => {
            if (!cancelled) {
                setAllMarkers(results);
                setLoadingArea(false);
                if (districtCenter) {
                    setFlyTo(districtCenter);
                    setFlyZoom(11);
                }
            }
        }).catch(() => {
            if (!cancelled) setLoadingArea(false);
        });

        return () => { cancelled = true; };
    }, [districtCenter]);

    /* ────────────────────────────────────────────────────────
       LIVE SEARCH: Debounced Nominatim search as user types
       ──────────────────────────────────────────────────────── */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!searchTerm || searchTerm.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            setError('');

            try {
                const results = await searchHospitalsByName(searchTerm, districtName || '');
                setSuggestions(results);
                setShowSuggestions(results.length > 0);

                if (results.length === 0 && searchTerm.length >= 3) {
                    setError(`No hospitals found for "${searchTerm}". Try a different name.`);
                }
            } catch {
                setError('Search failed. Please try again.');
            } finally {
                setSearching(false);
            }
        }, 400); // 400ms debounce — prevents spamming the API

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm, districtName]);

    /* ────────────────────────────────────────────────────────
       CLICK OUTSIDE: close suggestions dropdown
       ──────────────────────────────────────────────────────── */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ── Select a hospital ── */
    const handleSelectHospital = useCallback((hospital) => {
        if (disabled) return;
        onSelectHospital(hospital);
        setSearchTerm(hospital.name);
        setShowSuggestions(false);
        setFlyTo([hospital.lat, hospital.lon]);
        setFlyZoom(16);

        // Add to map markers if not already there
        setAllMarkers((prev) => {
            const exists = prev.some((m) => m.id === hospital.id);
            return exists ? prev : [...prev, hospital];
        });
    }, [disabled, onSelectHospital]);

    /* ── Input handlers ── */
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!e.target.value) {
            onSelectHospital(null);
            setSuggestions([]);
        }
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const mapCenter = districtCenter || countryCenter;
    const mapZoom = districtCenter ? 11 : countryZoom;

    // Combine: selected hospital marker + area markers
    const mapMarkers = selectedHospital
        ? allMarkers.some((m) => m.id === selectedHospital.id)
            ? allMarkers
            : [...allMarkers, selectedHospital]
        : allMarkers;

    return (
        <div className="hospital-map-picker">

            {/* ── Search Input ── */}
            <div className="hmp-autocomplete-wrap">
                <div className="hmp-search-input-wrap">
                    <Search size={16} className="hmp-search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={
                            districtName
                                ? `Type hospital name in ${districtName}… (e.g. "main hospital")`
                                : 'Select a district first'
                        }
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        disabled={disabled || !districtName}
                        className="hmp-search-input"
                        autoComplete="off"
                    />
                    {searching && <Loader size={16} className="hmp-input-spinner" />}
                </div>

                {/* ── Suggestions Dropdown ── */}
                {showSuggestions && (
                    <ul className="hmp-suggestions" ref={suggestionsRef}>
                        <li className="hmp-suggestions-header">
                            {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </li>
                        {suggestions.map((h) => (
                            <li
                                key={h.id}
                                className={`hmp-suggestion-item ${selectedHospital?.id === h.id ? 'selected' : ''}`}
                                onClick={() => handleSelectHospital(h)}
                            >
                                <MapPin size={14} className="hmp-item-icon" />
                                <div className="hmp-item-info">
                                    <span className="hmp-item-name">{h.name}</span>
                                    {h.shortAddress && <span className="hmp-item-address">{h.shortAddress}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Status ── */}
            {loadingArea && (
                <div className="hmp-status-bar">
                    <Loader size={14} className="hmp-spinner" />
                    <span>Loading hospitals in <strong>{districtName}</strong>…</span>
                </div>
            )}

            {error && (
                <div className="hmp-error">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* ── Leaflet Map ── */}
            <div className="hmp-map-container">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    className="hmp-map"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {flyTo && <FlyToPosition position={flyTo} zoom={flyZoom} />}

                    {mapMarkers.map((h) => (
                        <Marker
                            key={h.id}
                            position={[h.lat, h.lon]}
                            icon={selectedHospital?.id === h.id ? selectedIcon : defaultIcon}
                            eventHandlers={{
                                click: () => handleSelectHospital(h),
                            }}
                        >
                            <Popup>
                                <strong>{h.name}</strong>
                                {h.shortAddress && <><br /><span>{h.shortAddress}</span></>}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* ── Selected Badge ── */}
            {selectedHospital && (
                <div className="hmp-selected-badge">
                    <MapPin size={14} />
                    <span>Selected: <strong>{selectedHospital.name}</strong></span>
                </div>
            )}
        </div>
    );
};

export default HospitalMapPicker;
