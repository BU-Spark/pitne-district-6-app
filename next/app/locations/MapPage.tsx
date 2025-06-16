'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Papa from 'papaparse';
import wellknown from 'wellknown';
import { categoryMeta, getIconForCategory } from '../utils/categoryMeta';
import { FaFilter } from 'react-icons/fa';
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import { Location } from '../utils/strapi.api';

export default function MapPage() {
  interface LocationData {
    id: number;
    name: string;
    lat: number;
    lng: number;
    category?: string;
    phone?: string;
    website?: string;
    email?: string;
  }

  const districtColor = getComputedStyle(document.documentElement).getPropertyValue('--color-optimistic-blue').trim();

  const [district6Coords, setDistrict6Coords] = useState<[number, number][]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(Object.keys(categoryMeta)));
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const togglePopup = () => {
    setShowFilterPopup((prev) => !prev);
  };

  const getFilteredLocations = (locationsToFilter: LocationData[]) => {
    if (selectedCategories.size === 0) return [];
    if (selectedCategories.size === Object.keys(categoryMeta).length) return locationsToFilter;
    return locationsToFilter.filter((loc) => loc.category && selectedCategories.has(loc.category));
  };

  const filteredLocations = isSearching
    ? getFilteredLocations(searchResults)
    : getFilteredLocations(locations.filter((loc) => loc.lat && loc.lng));

  const handleSearchResults = (results: Location[], searching: boolean) => {
    const convertedResults = results.map((loc) => ({
      id: loc.id,
      name: loc.name,
      lat: loc.lat || 0,
      lng: loc.lng || 0,
      category: loc.category,
      phone: loc.phone?.toString(),
      website: loc.website,
      email: loc.email,
    }));
    setSearchResults(convertedResults);
    setIsSearching(searching);
  };

  useEffect(() => {
    fetch('/district6Coords.csv')
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const firstRow = result.data[0] as { WKT: string };
            if (firstRow?.WKT) {
              const parsed = wellknown.parse(firstRow.WKT) as { coordinates: number[][][] };
              if (parsed?.coordinates) {
                const coords = parsed.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number]);
                setDistrict6Coords(coords);
              }
            }
          },
        });
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:1337/api/locations?pagination[page]=1&pagination[pageSize]=1000')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setLocations(data.data as LocationData[]);
        else console.warn('No location data in API response.');
      })
      .catch((err) => console.error('Error loading locations:', err));
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showFilterPopup);
  }, [showFilterPopup]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        {!isMobile && (
          <Sidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onSearchResults={handleSearchResults}
          />
        )}
        <div className="map-container" style={isMobile ? { marginTop: '12px' } : {}}>
          <MapContainer
            center={[42.3061, -71.1204]}
            zoom={16}
            zoomControl={false}
            className="leaflet-map"
            style={{ height: '100%', width: '100%' }}
            maxBounds={[
              [42.23, -71.2],
              [42.45, -70.97],
            ]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom
            dragging
            doubleClickZoom
          >
            <ZoomControl position={isMobile ? 'topright' : 'topleft'} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution={
                isMobile
                  ? ''
                  : '&copy; <a href="https://carto.com/">CARTO</a> contributors &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              }
            />
            {filteredLocations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={getIconForCategory(loc.category)}>
                <Popup>
                  <div className="popup-content">
                    <strong>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {loc.name}
                      </a>
                    </strong>
                    {loc.category && (
                      <div className="inline-item">
                        <i>{loc.category}</i>
                      </div>
                    )}
                    {loc.website && (
                      <div className="inline-item">
                        <FiGlobe size={14} style={{ marginRight: 2 }} />
                        <a href={loc.website} target="_blank" rel="noopener noreferrer">
                          {loc.website}
                        </a>
                      </div>
                    )}
                    {loc.phone && (
                      <div className="inline-item">
                        <FiPhone size={14} style={{ marginRight: 2 }} />
                        {loc.phone}
                      </div>
                    )}
                    {loc.email && (
                      <div className="inline-item">
                        <FiMail size={14} style={{ marginRight: 2 }} />
                        <a href={`mailto:${loc.email}`}>{loc.email}</a>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polygon
              positions={district6Coords}
              pathOptions={{
                color: districtColor,
                weight: 2,
                fillColor: districtColor,
                fillOpacity: 0.2,
              }}
            />
          </MapContainer>

          {isMobile && (
            <div className={`mobile-filter-button ${showFilterPopup ? 'open' : ''}`} onClick={togglePopup}>
              <FaFilter />
            </div>
          )}

          {showFilterPopup && isMobile && (
            <>
              <div className="filter-backdrop" onClick={togglePopup} />
              <div className="filter-popup bottom-sheet">
                <Sidebar
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  onSearchResults={handleSearchResults}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
